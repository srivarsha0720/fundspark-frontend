import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
const Category = () => {
  const navigate = useNavigate();
  const { category } = useParams();
const [projects, setProjects] = useState([]);
const [loading, setLoading] = useState(true);
const [search, setSearch] = useState("");
const [fundingFilter, setFundingFilter] = useState("all");
const [sortBy, setSortBy] = useState("trending");
  /* ===== READ PROJECTS FROM LOCAL STORAGE ONLY ===== */
  //const projects = JSON.parse(localStorage.getItem("projects")) || [];
useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch("https://fundspark-backend.onrender.com/api/projects");
        const data = await res.json();

        if (res.ok) {
          setProjects(data);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);
 


const finalProjects = projects
  .filter((p) => {
    

    const normalizedProjectCategory =
  p.category?.toLowerCase().trim().replace(/\s+/g, "-");

const normalizedSelectedCategory =
  category?.toLowerCase().trim().replace(/\s+/g, "-");

const knownCategories = [
  "art",
  "technology",
  "startups",
  "social causes",
  "education",
  "healthcare",
  "environment",
  "food",
  "gaming",
  "music",
  "film",
  "design",
  "fashion",
  "publishing",
  "community",
];

const matchesCategory =
  normalizedSelectedCategory === "all"
    ? true
    : normalizedSelectedCategory === "others"
    ? !knownCategories.includes(normalizedProjectCategory)
    : normalizedProjectCategory === normalizedSelectedCategory;


    // search filter
    const matchesSearch = p.title
      ?.toLowerCase()
      .includes(search.toLowerCase());

    // funding filter
    const percent = p.goal ? (p.raised / p.goal) * 100 : 0;

    let matchesFunding = true;

    if (fundingFilter === "funded") matchesFunding = percent >= 100;
    if (fundingFilter === "almost") matchesFunding = percent >= 75 && percent < 100;
    if (fundingFilter === "new") matchesFunding = percent < 25;

    return matchesCategory && matchesSearch && matchesFunding;
  })
  .sort((a, b) => {
    if (sortBy === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
    if (sortBy === "funded") return b.raised - a.raised;
    if (sortBy === "ending") return new Date(a.deadline) - new Date(b.deadline);

    return b.raised-a.raised;
  });



if (loading) return <div className="p-10">Loading...</div>;
  return (
    <div className="max-w-7xl mx-auto px-6 mt-6">
 <input
  type="text"
  placeholder="Search projects..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  className="input-premium md:w-[40%] px-5 py-3 rounded-full 
bg-white text-slate-800 placeholder-slate-400
border border-slate-300 shadow-sm
focus:outline-none focus:ring-2 focus:ring-indigo-400

dark:bg-slate-800 dark:text-white dark:placeholder-slate-400
dark:border-slate-600 transition"
/>

  <div className="max-w-7xl mx-auto px-6 mt-4 flex gap-4 flex-wrap">

  {/* Funding filter */}
  <select
    value={fundingFilter}
    onChange={(e) => setFundingFilter(e.target.value)}
    className="
px-4 py-2 rounded-full
bg-white/80 dark:bg-white/10
text-slate-900 dark:text-white
border border-black/10 dark:border-white/20
backdrop-blur
hover:shadow-md transition
focus:outline-none focus:ring-2 focus:ring-indigo-400/40
"
  >
    <option  className="bg-white text-black dark:bg-slate-900 dark:text-white" value="all">All Projects</option>
    <option className="bg-white text-black dark:bg-slate-900 dark:text-white"  value="funded">Fully Funded</option>
    <option className="bg-white text-black dark:bg-slate-900 dark:text-white" value="almost">Almost There (75%+)</option>
    <option  className="bg-white text-black dark:bg-slate-900 dark:text-white" value="new">Just Launched</option>
  </select>

  {/* Sort filter */}
  <select
    value={sortBy}
    onChange={(e) => setSortBy(e.target.value)}
   className="bg-white text-black dark:bg-slate-900 dark:text-white"
  >
    <option  value="trending">Trending</option>
    <option  value="newest">Newest</option>
    <option  value="funded">Most Funded</option>
    <option  value="ending">Ending Soon</option>
  </select>

</div>



    <div className="max-w-7xl mx-auto px-6 py-10">
      <h2 className="text-3xl font-bold mb-8 capitalize text-slate-900 dark:text-white">
        {category === "all" ? "All Projects" : `${category} Projects`}
      </h2>

      {finalProjects.length === 0 && (
  <p className="text-gray-500 dark:text-slate-400 text-center mt-10">
    😔 No matching projects found
  </p>
)}

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {finalProjects.map((project) => {
          const percent = project.goal
            ? Math.min((project.raised / project.goal) * 100, 100)
            : 0;

          return (
            <div
              key={project.id}
              onClick={() => navigate(`/project/${project.id}`)}
             className="glass rounded-2xl overflow-hidden cursor-pointer
  hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 group"
            >
              {/* IMAGE */}
              <div className="relative">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition duration-500"
                />

                <span className="absolute top-3 left-3 px-3 py-1 text-xs rounded-full
  bg-white/90 dark:bg-black/60 backdrop-blur text-gray-800 dark:text-gray-200">
    {project.category}
  </span>
              </div>

              {/* BODY */}
<div className="p-5 space-y-3">
  <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-100">
    {project.title}
  </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
    {project.desc}
  </p>

                {/* progress bar */}
 <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full">
  <div
    className="h-2 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400"
    style={{ width: `${percent}%` }}
  />
</div>

                {/* AMOUNT */}
              <div className="flex justify-between text-xs font-medium">
    <span className="text-indigo-600 dark:text-indigo-400">
      ₹{project.raised}
    </span>

    <span className="text-gray-400 dark:text-gray-500">
      ₹{project.goal}
    </span>
  </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
    </div>
  );
};

export default Category;