
from pathlib import Path

from langchain_chroma import Chroma

from rag.embeddings import get_embedding_model


# Persistent ChromaDB storage directory
CHROMA_PATH = Path(__file__).resolve().parent / "chroma_db"

COLLECTION_NAME = "careerpilot_documents"


def get_vector_store():
    embeddings = get_embedding_model()

    vector_store = Chroma(
        collection_name=COLLECTION_NAME,
        embedding_function=embeddings,
        persist_directory=str(CHROMA_PATH),
    )

    return vector_store


def store_chunks(chunks, document_id, document_type, filename):
    vector_store = get_vector_store()

    metadatas = [
        {
            "document_id": str(document_id),
            "document_type": document_type,
            "filename": filename,
            "chunk_index": index,
        }
        for index in range(len(chunks))
    ]

    ids = [
        f"document_{document_id}_chunk_{index}"
        for index in range(len(chunks))
    ]

    vector_store.add_texts(
        texts=chunks,
        metadatas=metadatas,
        ids=ids,
    )

    return len(chunks)
