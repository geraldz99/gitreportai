/* eslint-disable @next/next/no-img-element */
"use client";
import Navbar from "./components/Navbar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./components/ui/Card";
import { Badge } from "./components/ui/Badge";
import { GitBranch, Star, GitFork, Clock } from "lucide-react";
import { Button } from "./components/ui/Button";
import { useEffect, useState } from "react";
import Loading from "./components/Loading";
import Popup from "./components/Popup";

interface Repo {
  id: string;
  name: string;
  visibility: string;
  description: string;
  language: string;
  stargazers_count: number;
  forks: number;
  created_at: string;
  url: string;
}

const Projects = () => {
  const [tokenGit, setTokenGit] = useState<string | null>(null);
  const [objRep, setObjRep] = useState([]);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDatas, setDatas] = useState<string | null>(null);
  const [isPopup, setPopup] = useState(false);

  useEffect(() => {
    const loadToken = async () => {
      try {
        const res = await fetch("/api/auth/get-token?tokenParams=token");
        const data = await res.json();
        setToken(data?.token?.value || null);
      } finally {
        setIsLoading(false);
      }
    };

    const loadTokenGit = async () => {
      const res = await fetch("/api/auth/get-token?tokenParams=githubToken");
      const data = await res.json();
      setTokenGit(data?.token?.value || null);
    };

    loadTokenGit();
    loadToken();
  }, []);

  const decoded = token ? atob(token) : ""; // decode base64 jika token ada
  let profileGit = null;

  if (decoded) {
    try {
      profileGit = JSON.parse(decoded);
    } catch (err) {
      console.error("JSON tidak valid:", err);
    }
  }

  // console.log(profileGit?.repos_url);

  useEffect(() => {
    const loadRepos = async () => {
      try {
        if (!profileGit?.repos_url || !tokenGit) return;

        const res = await fetch(profileGit.repos_url + "?visibility=private", {
          headers: {
            Authorization: `Bearer ${tokenGit}`,
            "User-Agent": "Next.js",
          },
        });

        if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);

        const repos = await res.json();
        setObjRep(repos);
      } catch (err) {
        console.error("Fetch repos gagal:", err);
      }
    };

    loadRepos();
  }, [profileGit, tokenGit]);

  const handleReport = async (project: Repo) => {
    try {
      if (!project?.url || !tokenGit) return;

      setIsLoading(true);

      const res = await fetch(project.url + "/commits", {
        headers: {
          Authorization: `Bearer ${tokenGit}`,
          "User-Agent": "Next.js",
        },
      });

      if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);

      const repos = await res.json();
      const sha = repos[0].sha;

      const restCommit = await fetch(project.url + "/commits/" + sha, {
        headers: {
          Authorization: `Bearer ${tokenGit}`,
          "User-Agent": "Next.js",
        },
      });

      const summary = await restCommit.json();
      let fixSumary = [];

      if (summary.files && summary.files.length > 5) {
        fixSumary = summary.files.slice(0, 10);
      } else {
        fixSumary = summary.files;
      }

      console.log(fixSumary);


      const response = await fetch("https://api.groq.com/openai/v1/responses", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "openai/gpt-oss-120b",
          input: `Jelaskan commit berikut singkat saja dalam bahasa indonesia tanpa ada bahasa inggris untuk report harian serta tidak usah ada dampak: \n\n${JSON.stringify(
            fixSumary
          )}`,
        }),
      });

      const value = await response.json();
      setPopup(true);
      setDatas(value.output?.[1]?.content[0].text);

      if (response) {
        setIsLoading(false);
      }
    } catch (err) {
      console.error("Fetch repos gagal:", err);
    }
  };

  // if (isLoading) {
  //   return <Loading />;
  // }

  // if(isPopup) {
  //   return <Popup />
  // }

  const projects = objRep as Repo[];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      {isLoading && <Loading />}
      {isPopup && isDatas ? (
        <Popup text={isDatas} onClose={() => setPopup(false)} />
      ) : null}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex">
            <img
              className="w-18 h-18 rounded-full mx-4 shadow-lg"
              src={profileGit?.avatar_url}
              alt="GitHub Avatar"
            />

            <div>
              <h1 className="text-4xl font-bold text-black mb-2">
                Welcome, {profileGit?.name}
              </h1>
              <p className="text-black">
                Manage and monitor your GitHub repositories
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project) => (
            <Card
              key={project.id}
              className="hover:shadow-md transition-shadow"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <GitBranch className="h-5 w-5 text-accent" />
                    <CardTitle className="text-xl">{project.name}</CardTitle>
                  </div>

                  <Badge variant="secondary" className="text-xs">
                    {project.visibility}
                  </Badge>
                </div>

                <CardDescription className="text-base mt-2">
                  {project.description ?? "-"}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded-full bg-accent"></span>
                    <span>{project.language ?? "-"}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4" />
                    <span>{project.stargazers_count ?? "-"}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <GitFork className="h-4 w-4" />
                    <span>{project.forks ?? "-"}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{project.created_at ?? "-"}</span>
                  </div>
                </div>

                <Button
                  onClick={() => handleReport(project)}
                  className="w-full mt-5 cursor-pointer bg-white hover:bg-slate-100 disabled:bg-slate-600 text-slate-900 font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 hover:shadow-lg disabled:cursor-not-allowed"
                >
                  Generate Report Otomatis
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Projects;
