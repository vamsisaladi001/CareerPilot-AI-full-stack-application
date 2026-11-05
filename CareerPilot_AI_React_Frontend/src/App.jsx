import { useState } from "react";
import {
  Sparkles, ArrowRight, UserRound, LockKeyhole, FileText,
  Upload, BriefcaseBusiness, Target, MessageCircle,
  LayoutDashboard, Settings, LogOut, Bell, ChevronDown,
  ShieldCheck, Check, CircleHelp, Search, Bot, BookOpen,
  Zap, X, Menu, FileCheck2, Gauge, Clock3, CircleCheck,
  ArrowUpRight
} from "lucide-react";

import {
  registerUser,
  loginUser,
  uploadDocument,
  askDocumentQuestion,
  saveJobDescription,
  analyzeSkillGap
} from "./api";
import "./styles.css";

function Brand() {
  return (
    <div className="brand">
      <span className="brand-mark"><Sparkles size={18} /></span>
      <span>CareerPilot <i>AI</i></span>
    </div>
  );
}

function AuthLayout({ children, register = false }) {
  return (
    <main className="login-page">
      <section className="login-visual">
        <Brand />
        <div className="visual-copy">
          <div className="eyebrow">
            <Sparkles size={14} />
            {register ? "START YOUR JOURNEY" : "YOUR NEXT CHAPTER STARTS HERE"}
          </div>
          <h1>
            {register ? <>Your future<br /><span>starts here.</span></> :
              <>Make your next<br /><span>move count.</span></>}
          </h1>
          <p>
            Your AI career copilot helps you understand your strengths,
            close skill gaps, and walk into interviews with confidence.
          </p>
          <div className="feature-list">
            <div><span><FileCheck2 size={18} /></span><section><b>Resume intelligence</b><small>Know what stands out and what is missing.</small></section></div>
            <div><span><Target size={18} /></span><section><b>Personalized career plan</b><small>Turn job requirements into your next steps.</small></section></div>
            <div><span><MessageCircle size={18} /></span><section><b>Interview practice</b><small>Build confidence one answer at a time.</small></section></div>
          </div>
        </div>
        <div className="visual-foot">
          <i /> A smarter way to move forward · Built around your goals
        </div>
        <div className="orb" />
      </section>

      <section className="login-form-side">
        <div className="mobile-brand"><Brand /></div>
        <div className="login-card">{children}</div>
        <div className="login-bottom">
          © 2026 CareerPilot AI · Designed for your next move
        </div>
      </section>
    </main>
  );
}

function Login({ onLogin, onSwitchToRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError("");

    try {
      setBusy(true);
      const data = await loginUser(email.trim(), password);

      onLogin({
        email: email.trim(),
        access: data.access,
        refresh: data.refresh
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthLayout>
      <div className="welcome-pill"><Sparkles size={13} /> WELCOME BACK</div>
      <h2>Sign in to your space</h2>
      <p className="muted">Pick up where your career journey left off.</p>

      <form onSubmit={submit}>
        <label htmlFor="email">Email address</label>
        <div className="field">
          <UserRound size={17} />
          <input id="email" type="email" placeholder="you@example.com"
            value={email} onChange={e => setEmail(e.target.value)} required />
        </div>

        <div className="label-row">
          <label htmlFor="password">Password</label>
        </div>
        <div className="field">
          <LockKeyhole size={17} />
          <input id="password" type="password" placeholder="Enter your password"
            value={password} onChange={e => setPassword(e.target.value)} required />
        </div>

        {error && <div className="error">{error}</div>}

        <button className="primary full" type="submit" disabled={busy}>
          {busy ? "Signing in..." : <>Sign in <ArrowRight size={17} /></>}
        </button>
      </form>

      <div className="separator"><span />YOUR CAREER, IN FOCUS<span /></div>
      <p className="muted">
        Don't have an account?{" "}
        <button type="button" className="link-button" onClick={onSwitchToRegister}>
          Create account
        </button>
      </p>
      <div className="security">
        <ShieldCheck size={16} /> Secured with Django JWT authentication.
      </div>
    </AuthLayout>
  );
}

function Register({ onSwitchToLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setBusy(true);
      await registerUser({ email: email.trim(), password });

      setSuccess("Account created successfully! You can now sign in.");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthLayout register>
      <div className="welcome-pill"><Sparkles size={13} /> JOIN CAREERPILOT AI</div>
      <h2>Create your account</h2>
      <p className="muted">Start building your next career move.</p>

      <form onSubmit={submit}>
        <label htmlFor="register-email">Email address</label>
        <div className="field">
          <UserRound size={17} />
          <input id="register-email" type="email" placeholder="you@example.com"
            value={email} onChange={e => setEmail(e.target.value)} required />
        </div>

        <label htmlFor="register-password">Password</label>
        <div className="field">
          <LockKeyhole size={17} />
          <input id="register-password" type="password" placeholder="Create a password"
            value={password} onChange={e => setPassword(e.target.value)} required />
        </div>

        <label htmlFor="confirm-password">Confirm password</label>
        <div className="field">
          <LockKeyhole size={17} />
          <input id="confirm-password" type="password" placeholder="Confirm your password"
            value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
        </div>

        {error && <div className="error">{error}</div>}
        {success && <div className="security">{success}</div>}

        <button className="primary full" type="submit" disabled={busy}>
          {busy ? "Creating account..." : <>Create account <ArrowRight size={17} /></>}
        </button>
      </form>

      <div className="separator"><span />YOUR CAREER, IN FOCUS<span /></div>
      <p className="muted">
        Already have an account?{" "}
        <button type="button" className="link-button" onClick={onSwitchToLogin}>
          Sign in
        </button>
      </p>
      <div className="security">
        <ShieldCheck size={16} /> Your account is secured by Django.
      </div>
    </AuthLayout>
  );
}

function Sidebar({ active, setActive, user, onLogout, open, onClose }) {
  const items = [
    ["Overview", LayoutDashboard],
    ["Resume analysis", FileText],
    ["Career roadmap", Target],
    ["Interview coach", MessageCircle]
  ];

  return (
    <>
      <div className={`overlay ${open ? "show" : ""}`} onClick={onClose} />
      <aside className={`sidebar ${open ? "open" : ""}`}>
        <div className="side-brand"><Brand /></div>
        <div className="nav-label">WORKSPACE</div>
        {items.map(([label, Icon]) => (
          <button key={label} className={`nav-item ${active === label ? "active" : ""}`}
            onClick={() => { setActive(label); onClose(); }}>
            <Icon size={18} />{label}
            {label === "Interview coach" && <small>NEW</small>}
          </button>
        ))}
        <div className="side-rule" />
        <div className="nav-label">YOUR SPACE</div>
        <button className={`nav-item ${active === "Profile" ? "active" : ""}`}
          onClick={() => { setActive("Profile"); onClose(); }}>
          <UserRound size={18} />My profile
        </button>
        <button className={`nav-item ${active === "Settings" ? "active" : ""}`}
          onClick={() => { setActive("Settings"); onClose(); }}>
          <Settings size={18} />Settings
        </button>
        <div className="side-spacer" />
        <div className="help-box">
          <span><CircleHelp size={17} /></span>
          <b>Need a little help?</b>
          <p>Your career journey is a work in progress. We're here to help.</p>
          <button onClick={() => setActive("Help")}>Visit help center <ArrowUpRight size={14} /></button>
        </div>
        <div className="side-user">
          <div className="avatar">{user.name.split(" ").map(x => x[0]).slice(0, 2).join("").toUpperCase()}</div>
          <div className="user-text"><b>{user.name}</b><small>{user.email}</small></div>
          <button className="icon-button" title="Sign out" onClick={onLogout}><LogOut size={16} /></button>
        </div>
      </aside>
    </>
  );
}


function Dashboard({ user, onLogout }) {
  const [active, setActive] = useState("Overview");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [resume, setResume] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [role, setRole] = useState("Python Developer");
  const [notice, setNotice] = useState("");
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [uploadedDocument, setUploadedDocument] = useState(null);
  const [chatBusy, setChatBusy] = useState(false);

  const initials = user.name
    .split(" ")
    .map(x => x[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  function fileChange(file) {
    setNotice("");
    if (!file) return;

    if (
      file.type !== "application/pdf" &&
      !file.name.toLowerCase().endsWith(".pdf")
    ) {
      setNotice("Please choose a PDF resume.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setNotice("Please choose a PDF smaller than 10 MB.");
      return;
    }

    setResume(file);
    setResult(null);
    setUploadedDocument(null);
    setMessages([]);
  }

  // COMPLETE SKILL GAP ANALYSIS
  async function analyze() {
    if (!resume && !uploadedDocument?.id) {
      setNotice("Upload your resume PDF first.");
      return;
    }

    if (!jobDescription.trim()) {
      setNotice("Please enter a job description.");
      return;
    }

    setNotice("");
    setBusy(true);
    setResult(null);

    try {
      // 1. Upload and index resume if not already uploaded
      let resumeDocument = uploadedDocument;

      if (!resumeDocument?.id) {
        const uploadResponse = await uploadDocument(
          resume,
          `${user.name}'s Resume`,
          "resume"
        );

        resumeDocument = uploadResponse.document;

        if (!resumeDocument?.id) {
          throw new Error("Resume ID was not returned after upload.");
        }

        setUploadedDocument(resumeDocument);
      }

      // 2. Save job description in PostgreSQL
      const jdResponse = await saveJobDescription(
        role,
        jobDescription.trim()
      );

      const jobDescriptionId = jdResponse.job_description?.id;

      if (!jobDescriptionId) {
        throw new Error("Job description ID was not returned.");
      }

      // 3. Call Gemini skill gap analysis API
      const analysisResponse = await analyzeSkillGap(
        resumeDocument.id,
        jobDescriptionId
      );

      if (!analysisResponse.analysis) {
        throw new Error("Analysis data was not returned.");
      }

      // 4. Store actual AI result
      setResult(analysisResponse.analysis);
      setNotice(
        analysisResponse.message ||
        "Skill gap analysis completed successfully!"
      );

      setActive("Resume analysis");

    } catch (error) {
      setNotice(
        error.message || "Skill gap analysis failed. Please try again."
      );
    } finally {
      setBusy(false);
    }
  }

  // RESUME CHAT
  async function sendChat(e) {
    e.preventDefault();

    const text = chatInput.trim();

    if (!text || chatBusy) return;

    if (!uploadedDocument?.id) {
      setNotice(
        "Upload and index your resume first, then ask questions about it."
      );
      setActive("Overview");
      return;
    }

    setMessages(previous => [
      ...previous,
      { role: "user", text }
    ]);

    setChatInput("");
    setChatBusy(true);

    try {
      const response = await askDocumentQuestion(
        uploadedDocument.id,
        text
      );

      setMessages(previous => [
        ...previous,
        {
          role: "assistant",
          text:
            response.answer ||
            "I couldn't find an answer in the uploaded document."
        }
      ]);

    } catch (error) {
      setMessages(previous => [
        ...previous,
        {
          role: "assistant",
          text:
            error.message ||
            "Sorry, I couldn't process that question."
        }
      ]);
    } finally {
      setChatBusy(false);
    }
  }

  const titles = {
    "Overview": "Your career, in motion",
    "Resume analysis": "Resume analysis",
    "Career roadmap": "Your career roadmap",
    "Interview coach": "Practice with your AI coach",
    "Profile": "Your profile",
    "Settings": "Settings",
    "Help": "Help center"
  };

  return (
    <div className="app-shell">
      <Sidebar
        active={active}
        setActive={setActive}
        user={user}
        onLogout={onLogout}
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />

      <main className="main">
        <header className="topbar">
          <div className="top-left">
            <button
              className="icon-button mobile-menu"
              onClick={() => setMobileOpen(true)}
            >
              <Menu size={20} />
            </button>

            <div className="crumb">
              Workspace <span>/</span> <b>{active}</b>
            </div>
          </div>

          <div className="top-actions">
            <div className="status">
              <i /> AI workspace preview
            </div>

            <button
              className="icon-button bell"
              onClick={() => setNotice("You're all caught up.")}
            >
              <Bell size={18} />
            </button>

            <button
              className="top-profile"
              onClick={() => setProfileOpen(!profileOpen)}
            >
              <div className="avatar small-avatar">{initials}</div>
              <ChevronDown size={14} />
            </button>

            {profileOpen && (
              <div className="profile-menu">
                <b>{user.name}</b>
                <small>{user.email}</small>

                <button
                  onClick={() => {
                    setActive("Profile");
                    setProfileOpen(false);
                  }}
                >
                  <UserRound size={15} /> My profile
                </button>

                <button onClick={onLogout}>
                  <LogOut size={15} /> Sign out
                </button>
              </div>
            )}
          </div>
        </header>

        <div className="content">
          <div className="page-heading">
            <div>
              <div className="eyebrow page-eyebrow">
                <i /> YOUR PERSONAL CAREER COPILOT
              </div>

              <h1>
                {active === "Overview" ? (
                  <>
                    Let's make your next move,{" "}
                    <span>{user.name.split(" ")[0]}.</span>
                  </>
                ) : titles[active]}
              </h1>

              <p>
                {active === "Overview"
                  ? "A little clarity today can open up a whole new direction tomorrow."
                  : "Your career workspace, built around your goals."}
              </p>
            </div>

            <button
              className="outline"
              onClick={() => setActive("Interview coach")}
            >
              <MessageCircle size={16} /> Ask CareerPilot
            </button>
          </div>

          {notice && (
            <div className="notice">
              <CircleHelp size={16} />
              {notice}
              <button onClick={() => setNotice("")}>
                <X size={15} />
              </button>
            </div>
          )}

          {(active === "Overview" || active === "Resume analysis") && (
            <>
              <section className="hero">
                <div className="hero-copy">
                  <div className="banner-tag">
                    <Sparkles size={13} /> YOUR NEXT CHAPTER STARTS HERE
                  </div>

                  <h2>
                    Small steps.<br />
                    <span>Big career momentum.</span>
                  </h2>

                  <p>
                    Bring your resume and a job you're interested in.
                    We'll help you connect the dots.
                  </p>

                  <button
                    onClick={() =>
                      document
                        .getElementById("resume-workbench")
                        ?.scrollIntoView({ behavior: "smooth" })
                    }
                  >
                    Start your analysis <ArrowRight size={16} />
                  </button>
                </div>

                <div className="hero-art">
                  <div className="orbit orbit1" />
                  <div className="orbit orbit2" />
                  <div className="hero-core">
                    <Sparkles size={30} />
                  </div>

                  <div className="float-card card-one">
                    <span className="float-icon green">
                      <Check size={15} />
                    </span>
                    <div>
                      <b>Know your strengths</b>
                      <small>Build on what you do well</small>
                    </div>
                  </div>

                  <div className="float-card card-two">
                    <span className="float-icon purple">
                      <Target size={15} />
                    </span>
                    <div>
                      <b>Find your next step</b>
                      <small>One focused plan at a time</small>
                    </div>
                  </div>
                </div>
              </section>

              <section className="stats">
                <div className="stat">
                  <div className="stat-top">
                    Resume status
                    <span className="stat-icon lavender">
                      <FileText size={17} />
                    </span>
                  </div>
                  <b>{uploadedDocument ? "Uploaded" : resume ? "Selected" : "Not added"}</b>
                  <small>
                    {uploadedDocument
                      ? "Uploaded and indexed"
                      : resume
                        ? "Ready to upload"
                        : "Start with your latest PDF"}
                  </small>
                </div>

                <div className="stat">
                  <div className="stat-top">
                    Target role
                    <span className="stat-icon blue">
                      <BriefcaseBusiness size={17} />
                    </span>
                  </div>
                  <b className="role-stat">{role}</b>
                  <small>Your current focus</small>
                </div>

                <div className="stat">
                  <div className="stat-top">
                    Career readiness
                    <span className="stat-icon peach">
                      <Gauge size={17} />
                    </span>
                  </div>
                  <b>
                    {result
                      ? `${result.overall_match_percentage}%`
                      : "—"}
                  </b>
                  <small>
                    {result
                      ? "AI skill-gap analysis completed"
                      : "Awaiting your analysis"}
                  </small>
                </div>
              </section>

              <section className="workbench" id="resume-workbench">
                <div className="section-head">
                  <div>
                    <div className="section-kicker">
                      GET PERSONALIZED INSIGHTS
                    </div>
                    <h2>Build your career snapshot</h2>
                    <p>
                      Upload your resume and paste a job description
                      to discover your skill gaps.
                    </p>
                  </div>

                  <span className="step">
                    <b>01</b> / 01
                  </span>
                </div>

                <div className="work-grid">
                  <div className="panel">
                    <div className="panel-title">
                      <span className="panel-icon">
                        <FileText size={18} />
                      </span>
                      <div>
                        <b>Your resume</b>
                        <small>Give us a starting point</small>
                      </div>
                      <em>REQUIRED</em>
                    </div>

                    <label
                      className={`dropzone ${resume ? "has-file" : ""}`}
                      htmlFor="resume-file"
                    >
                      <input
                        id="resume-file"
                        type="file"
                        accept=".pdf,application/pdf"
                        onChange={e => fileChange(e.target.files?.[0])}
                      />

                      <span className="upload-icon">
                        {resume
                          ? <FileCheck2 size={23} />
                          : <Upload size={23} />}
                      </span>

                      {resume ? (
                        <>
                          <b>{resume.name}</b>
                          <small>
                            {(resume.size / 1024 / 1024).toFixed(2)} MB ·{" "}
                            {uploadedDocument
                              ? "Uploaded and indexed"
                              : "Ready to upload"}
                          </small>
                          <i>Click to replace PDF</i>
                        </>
                      ) : (
                        <>
                          <b>Drop your resume here</b>
                          <small>or <i>browse files</i> to upload</small>
                          <small>PDF only · Max 10 MB</small>
                        </>
                      )}
                    </label>

                    <div className="privacy">
                      <ShieldCheck size={15} />
                      Your PDF is uploaded to Django and indexed for AI analysis.
                    </div>
                  </div>

                  <div className="panel">
                    <div className="panel-title">
                      <span className="panel-icon purple-bg">
                        <BriefcaseBusiness size={18} />
                      </span>
                      <div>
                        <b>Your target role</b>
                        <small>Tell us where you want to go</small>
                      </div>
                    </div>

                    <label className="input-label" htmlFor="role">
                      Job title
                    </label>

                    <div className="select-wrap">
                      <BriefcaseBusiness size={16} />

                      <select
                        id="role"
                        value={role}
                        onChange={e => setRole(e.target.value)}
                      >
                        <option>Python Developer</option>
                        <option>Full-Stack Developer</option>
                        <option>AI Engineer</option>
                        <option>Machine Learning Engineer</option>
                        <option>Backend Developer</option>
                        <option>Data Analyst</option>
                        <option>Other / custom role</option>
                      </select>

                      <ChevronDown size={15} />
                    </div>

                    <label className="input-label desc-label" htmlFor="jobdesc">
                      Job description
                      <small>Required for skill matching</small>
                    </label>

                    <textarea
                      id="jobdesc"
                      rows="4"
                      value={jobDescription}
                      onChange={e => setJobDescription(e.target.value)}
                      placeholder={
                        "Paste the job requirements here...\n\nSkills, responsibilities, experience, and qualifications."
                      }
                    />

                    <button
                      className="primary analyze"
                      disabled={
                        busy ||
                        (!resume && !uploadedDocument?.id)
                      }
                      onClick={analyze}
                    >
                      {busy ? (
                        <>
                          <span className="spinner" />
                          Analyzing your career fit...
                        </>
                      ) : (
                        <>
                          Analyze my skill gap
                          <ArrowRight size={16} />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </section>

              {/* REAL GEMINI ANALYSIS RESULTS */}
              {result && (
                <section className="panel results">
                  <div className="result-head">
                    <div>
                      <div className="section-kicker">
                        GEMINI AI ANALYSIS
                      </div>
                      <h2>Your career fit overview</h2>
                    </div>
                    <span className="sample-badge">LIVE AI RESULT</span>
                  </div>

                  <div className="score-row">
                    <div className="score-ring">
                      <b>{result.overall_match_percentage}%</b>
                      <small>Match score</small>
                    </div>
                    <p>{result.match_summary}</p>
                  </div>

                  <div className="result-cols">
                    <div>
                      <h3>
                        <CircleCheck size={17} />
                        Matched skills
                      </h3>

                      {(result.matched_skills || []).map((item, index) => (
                        <p key={index}>
                          <Check size={15} />
                          <span>
                            <b>
                              {typeof item === "string"
                                ? item
                                : item.skill}
                            </b>
                            {item.evidence && (
                              <small>{item.evidence}</small>
                            )}
                          </span>
                        </p>
                      ))}
                    </div>

                    <div>
                      <h3>
                        <Target size={17} />
                        Missing skills
                      </h3>

                      {(result.missing_skills || []).map((item, index) => (
                        <p key={index}>
                          <ArrowUpRight size={15} />
                          {typeof item === "string"
                            ? item
                            : item.skill || JSON.stringify(item)}
                        </p>
                      ))}
                    </div>
                  </div>

                  {result.partially_matched_skills?.length > 0 && (
                    <div className="result-cols">
                      <div>
                        <h3>
                          <Gauge size={17} />
                          Partially matched skills
                        </h3>

                        {result.partially_matched_skills.map((item, index) => (
                          <p key={index}>
                            <Target size={15} />
                            <span>
                              <b>
                                {typeof item === "string"
                                  ? item
                                  : item.skill}
                              </b>
                              {item.evidence && (
                                <small>{item.evidence}</small>
                              )}
                            </span>
                          </p>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="next-steps">
                    <h3>
                      <Zap size={17} />
                      Learning recommendations
                    </h3>

                    <ol>
                      {(result.learning_recommendations || []).map(
                        (item, index) => (
                          <li key={index}>
                            {typeof item === "string"
                              ? item
                              : item.recommendation ||
                                item.skill ||
                                JSON.stringify(item)}
                          </li>
                        )
                      )}
                    </ol>
                  </div>

                  {result.final_recommendation && (
                    <div className="next-steps">
                      <h3>
                        <Sparkles size={17} />
                        AI career recommendation
                      </h3>
                      <p>{result.final_recommendation}</p>
                    </div>
                  )}
                </section>
              )}

              <section className="bottom-grid">
                <div className="panel journey">
                  <div className="section-head compact">
                    <div>
                      <div className="section-kicker">YOUR JOURNEY</div>
                      <h2>One step at a time</h2>
                    </div>
                    <span className="mini-tag">3 steps</span>
                  </div>

                  {[
                    ["Upload your resume", "Give CareerPilot context about you."],
                    ["Explore your skill gaps", "Compare your experience to a target role."],
                    ["Practice your interviews", "Build confidence with role-specific practice."]
                  ].map(([a, b], i) => (
                    <div className="journey-row" key={a}>
                      <span>{i + 1}</span>
                      <div>
                        <b>{a}</b>
                        <small>{b}</small>
                      </div>
                      <Clock3 size={15} />
                    </div>
                  ))}
                </div>

                <div className="panel coach-card">
                  <div className="coach-top">
                    <span><Bot size={22} /></span>
                    <small><i /> READY TO HELP</small>
                  </div>

                  <h3>Got a career question?</h3>
                  <p>
                    Ask about skills, project ideas, or how to prepare
                    for your next interview.
                  </p>

                  <button
                    className="outline"
                    onClick={() => setActive("Interview coach")}
                  >
                    Chat with CareerPilot <ArrowRight size={15} />
                  </button>

                  <Sparkles className="coach-decoration" size={78} />
                </div>
              </section>
            </>
          )}

          {active === "Interview coach" && (
            <section className="chat-layout">
              <div className="panel chat-panel">
                <div className="chat-head">
                  <span><Bot size={22} /></span>
                  <div>
                    <b>CareerPilot Coach</b>
                    <small><i /> Gemini · RAG document assistant</small>
                  </div>
                  <em>
                    {uploadedDocument
                      ? "DOCUMENT INDEXED"
                      : "UPLOAD RESUME FIRST"}
                  </em>
                </div>

                <div className="chat-messages">
                  <div className="message assistant">
                    <span><Sparkles size={15} /></span>
                    <p>
                      Hey {user.name.split(" ")[0]}! 👋 Upload and index
                      your resume from the Overview page. Then ask me
                      questions about your document.
                    </p>
                  </div>

                  {messages.map((m, i) => (
                    <div key={i} className={`message ${m.role}`}>
                      <p>{m.text}</p>
                    </div>
                  ))}
                </div>

                <div className="suggestions">
                  {[
                    "Prepare me for a Python interview",
                    "What skills should I improve?",
                    "Suggest a portfolio project"
                  ].map(x => (
                    <button key={x} onClick={() => setChatInput(x)}>
                      {x} <ArrowUpRight size={13} />
                    </button>
                  ))}
                </div>

                <form className="chat-input" onSubmit={sendChat}>
                  <input
                    value={chatInput}
                    onChange={e => setChatInput(e.target.value)}
                    placeholder={
                      uploadedDocument
                        ? "Ask a question about your resume..."
                        : "Upload your resume to start asking questions..."
                    }
                  />

                  <button disabled={!chatInput.trim() || chatBusy}>
                    {chatBusy
                      ? <span className="spinner" />
                      : <ArrowRight size={18} />}
                  </button>
                </form>

                <small className="chat-note">
                  {uploadedDocument
                    ? `Answering from: ${uploadedDocument.title}`
                    : "Document-based Q&A is available after uploading and indexing your resume."}
                </small>
              </div>

              <aside className="panel tip-panel">
                <span className="panel-icon purple-bg">
                  <BookOpen size={18} />
                </span>

                <h3>Get better answers</h3>
                <p>
                  Tell your coach the role you're targeting, your
                  experience level, and what you want to improve.
                </p>

                <div className="tip">
                  <b>Try this</b>
                  <p>
                    “I'm targeting a junior Python developer role.
                    Create a 2-week interview plan based on my current skills.”
                  </p>
                  <button
                    onClick={() =>
                      setChatInput(
                        "I'm targeting a junior Python developer role. Create a 2-week interview plan based on my current skills."
                      )
                    }
                  >
                    Use prompt <ArrowRight size={14} />
                  </button>
                </div>

                <h3 className="coming-title">Coming to your coach</h3>

                {[
                  [FileText, "Resume context"],
                  [Search, "RAG knowledge search"],
                  [Zap, "Agent tools"]
                ].map(([Icon, x]) => (
                  <div className="tool-row" key={x}>
                    <Icon size={16} />{x}<small>SOON</small>
                  </div>
                ))}
              </aside>
            </section>
          )}

          {active === "Profile" && (
            <section className="panel profile-page">
              <div className="profile-head">
                <div className="avatar large-avatar">{initials}</div>
                <div>
                  <h2>{user.name}</h2>
                  <p>{user.email}</p>
                  <span className="sample-badge">PREVIEW PROFILE</span>
                </div>
              </div>

              <div className="profile-fields">
                <div><label>Full name</label><p>{user.name}</p></div>
                <div><label>Email address</label><p>{user.email}</p></div>
                <div><label>Target role</label><p>{role}</p></div>
                <div>
                  <label>Resume</label>
                  <p>{resume ? resume.name : "No resume uploaded yet"}</p>
                </div>
              </div>

              <p className="muted">
                Profile editing and secure storage will be connected to Django.
              </p>

              <button
                className="primary"
                onClick={() => setActive("Overview")}
              >
                Back to dashboard <ArrowRight size={16} />
              </button>
            </section>
          )}

          {["Career roadmap", "Settings", "Help"].includes(active) && (
            <section className="panel placeholder">
              <span><Target size={28} /></span>
              <h2>{titles[active]}</h2>
              <p>
                {active === "Career roadmap"
                  ? "Once your resume and target job are analyzed, CareerPilot will create a focused skill-building plan with milestones and resources."
                  : active === "Settings"
                    ? "Account preferences, privacy controls, and connected AI providers will be configured when we integrate Django."
                    : "Start by uploading a PDF resume and adding a target job description."}
              </p>

              <button
                className="primary"
                onClick={() => setActive("Overview")}
              >
                Back to overview <ArrowRight size={16} />
              </button>
            </section>
          )}
        </div>

        <footer className="footer">
          <Brand />
          <span>Make progress, one step at a time.</span>
          <small>CAREERPILOT AI · V1.0</small>
        </footer>
      </main>
    </div>
  );
}
export default function App() {
  const [user, setUser] = useState(null);
  const [showRegister, setShowRegister] = useState(false);

  function handleLogin(data) {
    sessionStorage.setItem("access", data.access);
    sessionStorage.setItem("refresh", data.refresh);

    const name = data.email
      .split("@")[0]
      .replace(/[._-]+/g, " ")
      .replace(/\b\w/g, c => c.toUpperCase());

    setUser({
      name: name || "Career Explorer",
      email: data.email
    });
  }

  function handleLogout() {
    sessionStorage.removeItem("access");
    sessionStorage.removeItem("refresh");
    setUser(null);
  }

  if (user) {
    return <Dashboard user={user} onLogout={handleLogout} />;
  }

  if (showRegister) {
    return (
      <Register
        onSwitchToLogin={() => setShowRegister(false)}
      />
    );
  }

  return (
    <Login
      onLogin={handleLogin}
      onSwitchToRegister={() => setShowRegister(true)}
    />
  );
}