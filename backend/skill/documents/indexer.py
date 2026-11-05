from .models import Document
from .utils import extract_pdf_text

from rag.splitting import split_text
from rag.store import store_chunks, get_vector_store


def index_document(document_id):
    try:
        # 1. Get uploaded document
        document = Document.objects.get(id=document_id)

        # 2. Extract PDF text
        text = extract_pdf_text(document.file.path)

        if not text.strip():
            raise ValueError("No readable text found in PDF.")

        # 3. Split text into chunks
        chunks = split_text(text)

        if not chunks:
            raise ValueError("No text chunks generated.")

        # 4. Remove previously indexed chunks for this document
        vector_store = get_vector_store()

        vector_store.delete(
            where={"document_id": str(document.id)}
        )

        # 5. Generate embeddings and store chunks
        stored_count = store_chunks(
            chunks=chunks,
            document_id=document.id,
            document_type=document.document_type,
            filename=document.file.name
        )

        return {
            "success": True,
            "document_id": document.id,
            "total_chunks": stored_count
        }

    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }
