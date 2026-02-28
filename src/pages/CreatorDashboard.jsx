import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {useState,useEffect} from "react";
const CreatorDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
const [projects, setProjects] = React.useState([]);
const [loading, setLoading] = React.useState(true);
const [updateOpenId, setUpdateOpenId] = useState(null);
const [updateText, setUpdateText] = useState("");



  //const projects = JSON.parse(localStorage.getItem("projects")) || [];

  // show only creator projects
  const myProjects = projects.filter(p => p.creator_id === user?.id);

  // const handleDelete = (id) => {
  //   const updated = projects.filter(p => p.id !== id);
  //   localStorage.setItem("projects", JSON.stringify(updated));
  //   window.location.reload();
  // };
  const handleDelete = async (id) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`http://localhost:5000/api/projects/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (res.ok) {
    alert("Deleted");
    window.location.reload();
  } else {
    alert(data.message);
  }
};

  if (!user) return <div className="p-10">Please login</div>;

//  if (loading) return <div className="p-10">Loading...</div>;


  const fetchProjects = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/projects");
      const data = await res.json();

      if (res.ok) {
        setProjects(data);
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
useEffect(() => {
  fetchProjects();
}, []);

const handlePostUpdate = async (projectId) => {
  if (!updateText.trim()) return;

  const token = localStorage.getItem("token");

  try {
    const res = await fetch(
      `http://localhost:5000/api/projects/${projectId}/updates`,   // ✅ correct route
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: updateText }),
      }
    );

    const data = await res.json();

    if (res.ok) {
      setUpdateText("");
      setUpdateOpenId(null);
      fetchProjects(); // refresh dashboard
    } else {
      alert(data.message);
    }
  } catch (err) {
    console.log(err);
    alert("Update failed");
  }
};
//   return (
//     <div className="p-10">
//       <h1 className="text-2xl font-bold mb-6">My Projects</h1>

//       <button
//         onClick={() => navigate("/start")}
//         className="bg-blue-600 text-white px-4 py-2 rounded mb-6"
//       >
//         + Create New Project
//       </button>

//       {myProjects.length === 0 ? (
//         <p>No projects created yet</p>
//       ) : (
//         <div className="grid md:grid-cols-3 gap-6">
//           {myProjects.map((p) => (
//             <div key={p.id} className="border p-4 rounded shadow">
//               <img src={p.image} className="w-full h-[450px] object-cover rounded-2xl" />

//               <h2 className="font-bold mt-2">{p.title}</h2>

//               <div className="flex gap-2 mt-3">
//                 <button
//                   onClick={() => navigate(`/project/${p.id}`)}
//                   className="text-blue-600"
//                 >
//                   View
//                 </button>

//                <button
//   onClick={() =>
//     setUpdateOpenId(updateOpenId === p.id ? null : p.id)
//   }
//   className="text-green-600"
// >
//   Update
// </button>

//                 <button
//                   onClick={() => handleDelete(p.id)}
//                   className="text-red-600"
//                 >
//                   Delete
//                 </button>
//               </div>

//               {updateOpenId === p.id && (
//   <div className="mt-3">
//     <textarea
//       placeholder="Write project progress..."
//       className="w-full border p-2 rounded"
//       value={updateText}
//       onChange={(e) => setUpdateText(e.target.value)}
//     />

//     <button
//       onClick={() => handlePostUpdate(p.id)}
//       className="mt-2 bg-green-500 text-white px-3 py-1 rounded"
//     >
//       Post Update
//     </button>
//   </div>
// )}

//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );


return (
  <div className="p-10 min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 dark:from-[#020617] dark:to-[#020617]">

    {/* heading + button */}
    <div className="flex items-center justify-between mb-10">
      <h1 className="text-4xl font-bold text-slate-800 dark:text-white">
        My Projects
      </h1>

      <button
        onClick={() => navigate("/start")}
        className="px-6 py-3 rounded-full bg-gradient-to-r from-indigo-500 to-emerald-400 text-white font-semibold shadow-lg hover:scale-105 transition"
      >
        + Create New Project
      </button>
    </div>

    {myProjects.length === 0 ? (
      <p className="text-slate-500 dark:text-slate-400">No projects created yet</p>
    ) : (
      <div className="grid md:grid-cols-3 gap-8 items-start">
        {myProjects.map((p) => (
         <div
  key={p.id}
  className="self-start rounded-3xl overflow-hidden 
  bg-white/70 dark:bg-white/5 backdrop-blur-xl 
  shadow-xl hover:shadow-2xl transition hover:scale-[1.02]"
>
            {/* image */}
            <img
              src={p.image}
              className="w-full h-[420px] object-cover"
            />

            {/* content */}
            <div className="p-6">
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-3">
                {p.title}
              </h2>

              <div className="flex gap-4 text-sm font-semibold">
                <button
                  onClick={() => navigate(`/project/${p.id}`)}
                 className="px-3 py-1 text-xs rounded-md border border-indigo-500 text-indigo-400 hover:bg-indigo-500/10 transition"
                >
                  👁View
                </button>

                <button
                  onClick={() =>
                    setUpdateOpenId(updateOpenId === p.id ? null : p.id)
                  }
                  className="px-3 py-1 text-xs rounded-md border border-emerald-500 text-emerald-400 hover:bg-emerald-500/10 transition"
                >
                  ✏Update
                </button>

                <button
                  onClick={() => handleDelete(p.id)}
                  className="px-3 py-1 text-xs rounded-md border border-red-500 text-red-400 hover:bg-red-500/10 transition"
                >
                 🗑 Delete
                </button>
              </div>

              {/* update textarea */}
              {updateOpenId === p.id && (
                <div className="mt-4">
                  <textarea
                    placeholder="Write project progress..."
                    className="w-full p-3 rounded-xl 
                    bg-slate-100 dark:bg-white/10 
                    border border-transparent 
                    focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={updateText}
                    onChange={(e) => setUpdateText(e.target.value)}
                  />

                  <button
                    onClick={() => handlePostUpdate(p.id)}
                    className="mt-3 px-4 py-2 rounded-full 
                    bg-gradient-to-r from-indigo-500 to-emerald-400 
                    text-white text-sm font-semibold shadow hover:opacity-90"
                  >
                    Post Update
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);
};



export default CreatorDashboard;