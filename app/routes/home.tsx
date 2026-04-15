import type { Route } from "./+types/home";
import Navbar from "~/components/navbar";
import { resumes } from "~/constants";
import ResumeCard from "~/components/ResumeCard";
import { usePuterStore } from "~/lib/puter";
import { Link, useLocation, useNavigate } from "react-router";
import { use, useEffect, useState } from "react";
export function meta({}: Route.MetaArgs) {
  return [
    { title: "Resumind" },
    { name: "description", content: "Smart feedback for your dream" },
  ];
}

export default function Home() {
  const { isLoading, auth, kv } = usePuterStore();
  const navigate = useNavigate();
  const [resume, setResume] = useState<Resume[]>([]);
  const [loadingResumes, setloadingResumes] = useState(false);
  useEffect(() => {
    if (isLoading) return;
    if (!auth.isAuthenticated) navigate("/auth?next=/");
  }, [auth.isAuthenticated]);
  useEffect(() => {
    const loadResume = async () => {
      setloadingResumes(true);
      const resumes = (await kv.list(`resume:*`, true)) as KVItem[];
      const parsedResumes = resumes?.map(
        (resume) => JSON.parse(resume.value) as Resume,
      );
      setResume(parsedResumes || []);
      setloadingResumes(false);
    };
    loadResume();
  }, []);
  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover">
      <Navbar />
      <section className="main-section">
        <div className="page-heading py-16">
          <h1>Track Your Applications & Resume Ratings</h1>
          {!loadingResumes && resume?.length == 0 ? (
            <h2>No resume found. Upload your first resume to get feedback.</h2>
          ) : (
            <h2>Review your submissions and check AI-prowred</h2>
          )}
        </div>
        {loadingResumes && (
          <div className="flex flex-col items-center justify-center">
            <img src="/images/resume-scan-2.gif" className="w-[200px]" />
          </div>
        )}
        {!loadingResumes && resumes.length > 0 && (
          <div className="resumes-section">
            {resumes.map((resume) => (
              <ResumeCard key={resume.id} resume={resume} />
            ))}
          </div>
        )}
        {!loadingResumes && resume?.length == 0 && (
          <div className="flex flex-col items-center justify-center mt-10 gap-4">
            <Link
              to="/upload"
              className="primary-button w-fit text-xl font-semibold"
            >
              Upload Resume
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
