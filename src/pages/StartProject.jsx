import { useState,useEffect } from "react";
import { useLocation,useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
const StartProject = () => {
  const {user}=useAuth();
  const navigate = useNavigate();
  const location=useLocation();
  //const [creator,setCreator]=useState("");
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [goal, setGoal] = useState("");
  const [image, setImage] = useState("");
  const [category, setCategory] = useState("");
  
  const [deadline, setDeadline] = useState("");
  const [milestones, setMilestones] = useState([
  { title: "", amount: "" }
]);
const [rewards, setRewards] = useState([
  { title: "", amount: "", description: "" }
]);
const addReward = () => {
  setRewards([...rewards, { title: "", amount: "", description: "" }]);
};
const handleRewardChange = (index, field, value) => {
  const updated = [...rewards];
  updated[index][field] = value;
  setRewards(updated);
};
const addMilestone = () => {
  setMilestones([...milestones, { title: "", amount: "" }]);
};

const handleMilestoneChange = (index, field, value) => {
  const updated = [...milestones];
  updated[index][field] = value;
  setMilestones(updated);
};
useEffect(() => {
  if (!user) {
    navigate("/login", { state: { from: location.pathname } });
  }
}, [user, navigate, location]);

  const handleCreate =async (e) => {
    e.preventDefault();
    console.log("clicked");
if (!user) {
    alert("Please login to create project");
    navigate("/login",{ state:{from:"/start"}});
    return;
  }

  if ( !title || !desc || !goal || !deadline) {
    alert("Please fill required fields");
    return;
  }
//   const stored = JSON.parse(localStorage.getItem("projects")) || [];
//   const newProject = {
//   id: Date.now(),
//   title,
//   desc,
//   image,
//   category: category.toLowerCase(),
//   goal: Number(goal),
//   deadline,
//   // creator: user.email,
//   creator_id:user.id,

//   rewards: rewards
//   .filter((r) => r.title && r.amount)
//   .map((r) => ({
//     title: r.title,
//     amount: Number(r.amount),
//     description: r.description
//   })),

//   // ⭐ MULTIPLE milestones saved
//   milestones: milestones
//     .filter((m) => m.title && m.amount)
//     .map((m) => ({
//       title: m.title,
//       amount: Number(m.amount),
//     })),

//   raised: 0,
//   backers: 0,
// };
//   localStorage.setItem("projects", JSON.stringify([newProject, ...stored]));
//   alert("Project Created ✅");
//   navigate("/category/all");

const token = localStorage.getItem("token");

const res = await fetch("http://localhost:5000/api/projects/create", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({
    title,
    description: desc,
    image,
    category,
    goal,
    deadline,
    milestones,
    rewards,
  }),
});

const data = await res.json();

if (res.ok) {
  alert("Project created 🎉");
  navigate("/");
} else {
  alert(data.message);
}
};
    

  return (
   <div className="max-w-2xl mx-auto px-4 mt-10">
  <div className="
    p-6 md:p-8 space-y-5
    rounded-2xl
    backdrop-blur-lg
    bg-white/70 dark:bg-white/5
    border border-gray-200 dark:border-white/10
    shadow-lg
  ">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-4">Create Project</h1>
{/* 
    <input
  type="text"
  placeholder="Creator Name"
  value={creator}
  onChange={(e) => setCreator(e.target.value)}
  className="w-full border p-2 rounded"
/> */}

      <input
        placeholder="Project Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full bg-white dark:bg-white/5 border border-gray-300 dark:border-white/10 focus:border-blue-500 outline-none rounded-lg px-4 py-2.5 text-gray-800 dark:text-white placeholder-gray-400 transition"
      />

      <textarea
        placeholder="Description"
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
       className="w-full min-h-[110px] bg-white dark:bg-white/5 border border-gray-300 dark:border-white/10 focus:border-blue-500 outline-none rounded-lg px-4 py-2.5 text-gray-800 dark:text-white placeholder-gray-400 transition"
      />

      <input
        placeholder="Image URL"
        value={image}
        onChange={(e) => setImage(e.target.value)}
        className="w-full bg-white dark:bg-white/5 border border-gray-300 dark:border-white/10 focus:border-blue-500 outline-none rounded-lg px-4 py-2.5 text-gray-800 dark:text-white placeholder-gray-400 transition"
      />

      <input
        placeholder="Funding Goal"
        type="number"
        value={goal}
        onChange={(e) => setGoal(e.target.value)}
        className="w-full bg-white dark:bg-white/5 border border-gray-300 dark:border-white/10 focus:border-blue-500 outline-none rounded-lg px-4 py-2.5 text-gray-800 dark:text-white placeholder-gray-400 transition"
      />

      <input
        placeholder="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
       className="w-full bg-white dark:bg-white/5 border border-gray-300 dark:border-white/10 focus:border-blue-500 outline-none rounded-lg px-4 py-2.5 text-gray-800 dark:text-white placeholder-gray-400 transition"
      />

      
<input
  type="date"
  value={deadline}
  onChange={(e) => setDeadline(e.target.value)}
  className="w-full bg-white dark:bg-white/5 border border-gray-300 dark:border-white/10 focus:border-blue-500 outline-none rounded-lg px-4 py-2.5 text-gray-800 dark:text-white placeholder-gray-400 transition"
  placeholder="Deadline"
/>
<h3 className="font-semibold mt-6 mb-2">Funding Milestones</h3>

{milestones.map((m, i) => (
  <div key={i} className="flex flex-col md:flex-row gap-3 mb-3">
    <input
      placeholder="Milestone title"
      value={m.title}
      onChange={(e) =>
        handleMilestoneChange(i, "title", e.target.value)
      }
      className="w-full bg-white dark:bg-white/5 border border-gray-300 dark:border-white/10 focus:border-blue-500 outline-none rounded-lg px-4 py-2.5 text-gray-800 dark:text-white placeholder-gray-400 transition"
    />

    <input
      type="number"
      placeholder="Unlock amount"
      value={m.amount}
      onChange={(e) =>
        handleMilestoneChange(i, "amount", e.target.value)
      }
      className="w-full bg-white dark:bg-white/5 border border-gray-300 dark:border-white/10 focus:border-blue-500 outline-none rounded-lg px-4 py-2.5 text-gray-800 dark:text-white placeholder-gray-400 transition"
    />
  </div>
))}

<button
  type="button"
  onClick={addMilestone}
  className="text-blue-500 hover:text-blue-600 text-sm cursor-pointer transition"
>
  + Add milestone
</button>


{/* ===== REWARDS ===== */}
<h3 className="font-semibold mt-6 mb-2">Backer Rewards</h3>

{rewards.map((reward, index) => (
 <div key={index} className="p-4 mb-4 rounded-xl space-y-3 bg-white/70 dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-sm">

    <input
      type="text"
      placeholder="Reward title"
      value={reward.title}
      onChange={(e) =>
        handleRewardChange(index, "title", e.target.value)
      }
      className="w-full bg-white dark:bg-white/5 border border-gray-300 dark:border-white/10 focus:border-blue-500 outline-none rounded-lg px-4 py-2.5 text-gray-800 dark:text-white placeholder-gray-400 transition"
    />

    <input
      type="number"
      placeholder="Minimum amount"
      value={reward.amount}
      onChange={(e) =>
        handleRewardChange(index, "amount", e.target.value)
      }
      className="w-full bg-white dark:bg-white/5 border border-gray-300 dark:border-white/10 focus:border-blue-500 outline-none rounded-lg px-4 py-2.5 text-gray-800 dark:text-white placeholder-gray-400 transition"
    />

    <textarea
      placeholder="Reward description"
      value={reward.description}
      onChange={(e) =>
        handleRewardChange(index, "description", e.target.value)
      }
      className="w-full min-h-[110px] bg-white dark:bg-white/5 border border-gray-300 dark:border-white/10 focus:border-blue-500 outline-none rounded-lg px-4 py-2.5 text-gray-800 dark:text-white placeholder-gray-400 transition"
    />
  </div>
))}

<button
  type="button"
  onClick={addReward}
  className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg shadow transition"
>
  + Add Reward
</button>
      <button type="button"
        onClick={handleCreate}
       className="w-full mt-4 py-3 rounded-xl font-semibold text-white 
  bg-gradient-to-r from-indigo-500 to-cyan-500 
  hover:from-indigo-600 hover:to-cyan-600 
  shadow-md hover:shadow-lg 
  transition duration-200 active:scale-[0.98]"
>
    
        🚀Create Project
      </button>
    </div>
    </div>
  );
};

export default StartProject;