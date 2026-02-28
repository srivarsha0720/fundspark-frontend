// Dynamic ProjectDetails page
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {supabase} from "../supabaseClient";
const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tab, setTab] = useState("rewards");

  /* ===== LOAD PROJECT FROM LOCAL STORAGE ===== */
const [project, setProject] = useState(null);
const [loading, setLoading] = useState(true);
/* ===== COMMENT STATES ===== */
  // const [comment, setComment] = useState("");
  // const [comments, setComments] = useState([]);
  // const [editingId, setEditingId] = useState(null);
  // const [editText, setEditText] = useState("");
  // COMMENTS
const [comments, setComments] = useState([]);
const [commentText, setCommentText] = useState("");
const [editingId, setEditingId] = useState(null);
const [editText, setEditText] = useState("");
const [showShare, setShowShare] = useState(false);
 /* ===== UPDATES STATE ===== */
const [updateText, setUpdateText] = useState("");
const [updates, setUpdates] = useState([]);
// ⭐ payment modal
const [showPayment, setShowPayment] = useState(false);
const [paymentMethod, setPaymentMethod] = useState("upi");
const [selectedAmount, setSelectedAmount] = useState("");
const [isPaying, setIsPaying] = useState(false);
const [paymentSuccess, setPaymentSuccess] = useState(false);
const [paymentStep, setPaymentStep] = useState("method");
const [selectedUpi, setSelectedUpi] = useState(null); 
const [selectedBank, setSelectedBank] = useState(null);

const [cardNumber, setCardNumber] = useState("");
const [expiry, setExpiry] = useState("");
const [cvv, setCvv] = useState("");

const [cardError, setCardError] = useState("");
const [daysLeft, setDaysLeft] = useState(0);
/* ⭐ state */

// const getDaysLeft = (deadline) => {
//   if (!deadline) return 0;

//   const diff =
//     new Date(deadline).getTime() - new Date().getTime();

//   return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
// };

// useEffect(() => {
//   if (project?.deadline) {
//     setDaysLeft(getDaysLeft(project.deadline));
//   }
// }, [project?.deadline]);
const getDaysLeft = (deadline) => {
  if (!deadline) return 0;

  const diff =
    new Date(deadline).getTime() - new Date().getTime();

  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
};
useEffect(() => {
  if (!project?.deadline) return;

  const updateDays = () => {
    setDaysLeft(getDaysLeft(project.deadline));
  };

  updateDays(); // run immediately

  const interval = setInterval(updateDays, 86400000); // ⭐ 24 hours

  return () => clearInterval(interval);
}, [project?.deadline]);

const handleCardNumber = (e) => {
  let value = e.target.value.replace(/\D/g, ""); // only digits

  if (value.length > 16) value = value.slice(0, 16);

  // add spacing
  value = value.replace(/(.{4})/g, "$1 ").trim();

  setCardNumber(value);
};



const handleExpiry = (e) => {
  let value = e.target.value.replace(/\D/g, "");

  if (value.length > 4) value = value.slice(0, 4);

  if (value.length >= 3) {
    value = value.slice(0, 2) + "/" + value.slice(2);
  }

  setExpiry(value);
};

const handleCvv = (e) => {
  let value = e.target.value.replace(/\D/g, "");

  if (value.length > 3) value = value.slice(0, 3);

  setCvv(value);
};


const validateCard = () => {
  const cleanNumber = cardNumber.replace(/\s/g, "");

  // ✅ Card number: only digits 16 length
  if (!/^\d{16}$/.test(cleanNumber)) {
    setCardError("Card number must contain only digits (13–19)");
    return false;
  }

  // ✅ Expiry format check (MM/YY)
  if (!/^\d{2}\/\d{2}$/.test(expiry)) {
    setCardError("Expiry must be in MM/YY format");
    return false;
  }

  const [monthStr, yearStr] = expiry.split("/");
  const month = parseInt(monthStr);
  const year = parseInt(`20${yearStr}`);

  // Month must be 01–12
  if (month < 1 || month > 12) {
    setCardError("Invalid expiry month");
    return false;
  }

  // Expiry must be future date
  const now = new Date();
  const expiryDate = new Date(year, month - 1, 1);
  expiryDate.setMonth(expiryDate.getMonth() + 1);

  if (expiryDate <= now) {
    setCardError("Card expired");
    return false;
  }

  // ✅ CVV: only digits, 3–4 length
  if (!/^\d{3,4}$/.test(cvv)) {
    setCardError("CVV must be 3 or 4 digits");
    return false;
  }

  setCardError("");
  return true;
};

const resetPaymentForm = () => {
  setCardNumber("");
  setExpiry("");
  setCvv("");
  setSelectedAmount("");
  setSelectedUpi(null);
  setSelectedBank(null);
  setPaymentStep("method");
};


const handlePostComment = async () => {
  console.log("Posting comment:", commentText);   

  if (!commentText.trim()) return;

  const token = localStorage.getItem("token");

  try {
    const res = await fetch(
      `http://localhost:5000/api/projects/${id}/comments`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text: commentText }),
      }
    );

    const data = await res.json();
    console.log(data);

    if (res.ok) {
      setCommentText("");
      fetchComments();
    }
  } catch (err) {
    console.log(err);
  }
};
const handleDeleteComment = async (commentId) => {
  const token = localStorage.getItem("token");

  await fetch(`http://localhost:5000/api/comments/${commentId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  fetchComments();
};

const handleSaveEdit = async (commentId) => {
  const token = localStorage.getItem("token");

  await fetch(`http://localhost:5000/api/comments/${commentId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ text: editText }),
  });

  setEditingId(null);
  fetchComments();
};


  const fetchProject = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/projects/${id}`);
      const data = await res.json();

      if (res.ok) {
        setProject(data.project || data);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  const fetchUpdates = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/projects/${id}/updates`);
      const data = await res.json();
       console.log("updates:", data); 
       if(res.ok){
        setUpdates(data);
       }
    } catch (err) {
      console.log(err);
    }
  };
  const fetchComments = async () => {
  try {
    const res = await fetch(
      `http://localhost:5000/api/projects/${id}/comments`
    );
    const data = await res.json();
    setComments(data);
  } catch (err) {
    console.log(err);
  }
};
useEffect(() => {
  fetchProject();
  fetchUpdates();
  fetchComments();
}, [id]);



// useEffect(() => {
//   if (!project?.deadline) return;

//   const calculateDays = () => {
//     const diff =
//       new Date(project.deadline).getTime() - new Date().getTime();

//     const days = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));

//     setDaysLeft(days);
//   };

//   calculateDays(); // run immediately

//   const interval = setInterval(calculateDays, 60000); // update every minute

//   return () => clearInterval(interval);
// }, [project?.deadline]);
/* ⭐ helper */






  // get projects from localStorage
// const storedProjects = JSON.parse(localStorage.getItem("projects")) || [];

// // find current project
// const project = storedProjects.find((p) => p.id === Number(id));
// if (!project) return <div className="p-10">Project not found</div>;



 
// useEffect(() => {
//   const stored = localStorage.getItem(`updates-${id}`);
//   if (stored) setUpdates(JSON.parse(stored));
// }, [id]);

  
  // useEffect(() => {
  //   const stored = localStorage.getItem(`comments-${id}`);
  //   if (stored) setComments(JSON.parse(stored));
  // }, [id]);



  // const handlePostComment = () => {
  //   if (!comment.trim()) return;

  //   const newComment = {
  //     id: Date.now(),
  //     text: comment,
  //    user:  user?.email || "Anonymous",
  //     time: new Date().toLocaleString(),
  //   };

  //   const updated = [newComment, ...comments];
  //   setComments(updated);
  //   localStorage.setItem(`comments-${id}`, JSON.stringify(updated));
  //   setComment("");
  // };

  // const handleDelete = (commentId) => {
  //   const updated = comments.filter((c) => c.id !== commentId);
  //   setComments(updated);
  //   localStorage.setItem(`comments-${id}`, JSON.stringify(updated));
  // };

  // const handleEditSave = (commentId) => {
  //   if (!editText.trim()) return;

  //   const updated = comments.map((c) =>
  //     c.id === commentId ? { ...c, text: editText } : c
  //   );

  //   setComments(updated);
  //   localStorage.setItem(`comments-${id}`, JSON.stringify(updated));

  //   setEditingId(null);
  //   setEditText("");
  // };
const handlePostUpdate = async () => {
  if (!updateText.trim()) return;

  try {
    const res = await fetch(
      `http://localhost:5000/api/projects/${id}/updates`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: updateText }),
      }
    );

    if (res.ok) {
      setUpdateText("");

      const data = await res.json();
      setUpdates((prev) => [data, ...prev]);
    }
  } catch (err) {
    console.log(err);
  }
};
// const handlePostUpdate = () => {
//   if (!user) return;

//   /* ⭐ only creator can post */
//   //if (user. email!== project.creator) {
//     if (user.id !== project.creator_id) {
//     alert("Only creator can post updates");
//     return;
//   }

//   if (!updateText.trim()) return;

  // const newUpdate = {
  //   id: Date.now(),
  //   text: updateText,
  //   time: new Date().toLocaleString(),
  // };

//   const updated = [newUpdate, ...updates];
//   setUpdates(updated);
//   localStorage.setItem(`updates-${id}`, JSON.stringify(updated));
//   setUpdateText("");
// };


  // if (!project) return <div className="p-10">Project not found</div>;

  // const percent = project.goal
  //   ? Math.round((project.raised / project.goal) * 100)
  //   : 0;

    // ===== FUND PROJECT =====
//   const handleFund = async () => {
//     if (!user) {
//     alert("Login to fund project");
//     navigate("/login");
//     return;
//   }
//   // ❌ stop if goal already reached
//   if (project.raised >= project.goal) {
//     alert("🎉 Goal already reached. Funding closed.");
//     return;
//   }
//   // ❌ stop if deadline passed
//   if (project.deadline && new Date(project.deadline) < new Date()) {
//     alert("⏳ Campaign ended. Funding closed.");
//     return;  }
//   const amount = Number(prompt("Enter amount to fund"));
//   if (!amount || amount <= 0) return;
//   // ❌ prevent exceeding goal
//   const remaining = project.goal - project.raised;
//   if (amount > remaining) {
//     alert(`Only ₹${remaining} needed to reach goal`);
//     return;
//   }
//   const token = localStorage.getItem("token");
// try {
//   const res = await fetch(
//     `http://localhost:5000/api/projects/fund/${project.id}`,
//     {
//       method: "PUT",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify({ amount }),
//     }
//   );
//   const data = await res.json();
//   if (res.ok) {
//     alert("Funding successful 🎉");
//     window.location.reload();
//   } else {
//     alert(data.message);  }
// } catch (err) {
//   console.log(err);
//   alert("Funding failed");
// }

const handleConfirmPayment = async () => {
  if (!user) {
    alert("Login to fund project");
    navigate("/login");
    return;
  }

  if (project.raised >= project.goal) {
    alert("Goal already reached");
    return;
  }

  if (project.deadline && new Date(project.deadline) < new Date()) {
    alert("Campaign ended");
    return;
  }

  const amount = Number(selectedAmount);
  if (!amount || amount <= 0) {
    alert("Enter valid amount");
    return;
  }

  const remaining = project.goal - project.raised;
  if (amount > remaining) {
    alert(`Only ₹${remaining} needed`);
    return;
  }

  try {
    setIsPaying(true);
    setPaymentStep("processing");

    await new Promise((r) => setTimeout(r, 1500));

    await supabase.from("funding").insert({
      project_id: project.id,
      user_id: user.id,
      amount,
      payment_method: paymentMethod,
    });

    await supabase
      .from("projects")
      .update({
        raised: Number(project.raised) + Number(amount),
        backers:Number(project.backers || 0) + 1,
      })
      .eq("id", project.id);
      setProject((prev) => ({
    ...prev,
    raised: prev.raised + Number(amount),
    backers: (prev.backers || 0) + 1,
  }));

    setIsPaying(false);
    setPaymentStep("success");

    setTimeout(() => {
      setShowPayment(false);
      resetPaymentForm();
      
    }, 1800);
  } catch (err) {
    console.log(err);
    setIsPaying(false);
    alert("Payment failed");
  }





// const handleCardNumber = (e) => {
//     let value = e.target.value.replace(/\D/g, "");

//     if (value.length > 16) value = value.slice(0, 16);

//     value = value.replace(/(.{4})/g, "$1 ").trim();

//     setCardNumber(value);
//   };

  // const updatedProjects = storedProjects.map((p) => {
  //   if (p.id === project.id) {
  //     return {
  //       ...p,
  //       raised: (p.raised || 0) + amount,
  //       backers: (p.backers || 0) + 1,
  //     };
  //   }
  //   return p;
  // });

  // localStorage.setItem("projects", JSON.stringify(updatedProjects));

  // window.location.reload();






  
};
if (loading) return <div className="p-10">Loading...</div>;
if (!project) return <div className="p-10">Project not found</div>;

const percent = project.goal
  ? Math.round((project.raised / project.goal) * 100)
  : 0;
  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <button
        onClick={() => navigate(-1)}
        className="text-blue-600 mb-6 font-medium"
      >
        ← Back to projects
      </button>

      <div className="grid lg:grid-cols-3 gap-10">
        {/* LEFT */}
        <div className="lg:col-span-2">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-[450px] object-cover rounded-2xl"
          />

          <h1 className="text-3xl font-bold mt-5">{project.title}</h1>
{/* 
          <p className="text-gray-600 mt-3">{project.desc}</p> */}
          <p className="text-gray-600 mt-3">{project.description}</p>

          {/* STORY
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-3">Story</h2>
            <p className="text-gray-600">
              {project.desc || "Story will be updated soon."}
            </p>
          </div> */}

          {/* TABS */}
          <div className="flex gap-6 mt-10 border-b pb-2">
            {["rewards", "milestones", "updates", "comments"].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`capitalize ${
                  tab === t
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
{/* REWARDS */}
         
{/* {tab === "rewards" && (
  <div className="mt-6">
    {project.rewards && project.rewards.length > 0 ? (
      <div className="space-y-4">
        {project.rewards.map((reward, index) => (
          <div
            key={index}
            className="border rounded-xl p-5 shadow-sm bg-white"
          >
            <h4 className="font-semibold text-lg">{reward.title}</h4>

            {reward.description && (
              <p className="text-gray-600 mt-1">{reward.description}</p>
            )}

            <p className="font-bold mt-2 text-indigo-600">
              ₹{reward.amount}
            </p>
          </div>
        ))}
      </div>
    ) : (
      <p className="text-gray-500">No rewards added</p>
    )}
  </div>
)} */}
    {tab === "rewards" && (
  <div className="mt-6">

    {project?.rewards?.length > 0 ? (
      <div className="grid md:grid-cols-2 gap-6">
        {project.rewards.map((reward) => (
          <div
            key={reward.id}
           className="rounded-2xl p-6 transition duration-300

bg-white shadow-md border border-slate-200

dark:bg-white/5 dark:border-white/10 dark:shadow-none backdrop-blur-xl

hover:shadow-xl hover:scale-[1.02]

dark:hover:bg-white/10 dark:hover:shadow-cyan-500/10"
          >
            <h4 className="font-semibold text-lg text-slate-800 dark:text-white">{reward.title}</h4>

            {reward.description && (
              <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">{reward.description}</p>
            )}

            <p className="font-bold mt-3 text-indigo-600 dark:text-cyan-400 text-lg">
              ₹{reward.amount}
            </p>
          </div>
        ))}
      </div>
    ) : (
      <p className="text-gray-500">No rewards added</p>
    )}

  </div>
)}
          {/* MILESTONES */}
          {/* {tab === "milestones" && (
  <div className="mt-6">
    {project.milestones && project.milestones.length > 0 ? (
      <div className="space-y-4">
        {project.milestones.map((milestone, index) => {
          const completed = project.raised >= milestone.amount;

          return (
            <div
              key={index}
              className={`border rounded-xl p-5 shadow-sm ${
                completed ? "bg-green-50 border-green-400" : "bg-white"
              }`}
            >
              <h4 className="font-semibold text-lg">{milestone.title}</h4>

              <p className="text-gray-500 mt-1">
                Target ₹{milestone.amount}
              </p>

              <p
                className={`mt-2 font-medium ${
                  completed ? "text-green-600" : "text-gray-400"
                }`}
              >
                {completed ? "Completed ✅" : "Not started"}
              </p>
            </div>
          );
        })}
      </div>
    ) : (
      <p className="text-gray-500">No milestones yet</p>
    )}
  </div>
)} */}

  {tab === "milestones" && (
  <div className="mt-6">

    {project?.milestones?.length > 0 ? (
      <div className="space-y-4">

        {project.milestones.map((milestone) => {
          const completed = project.raised >= milestone.amount;

          return (
            <div
              key={milestone.id}
              className={`rounded-2xl p-6 transition duration-300 backdrop-blur-xl

border border-slate-200 shadow-md

dark:bg-white/5 dark:border-white/10 dark:shadow-none

hover:shadow-xl hover:scale-[1.02]

${completed
  ? "bg-green-50 dark:bg-green-500/10 border-green-400"
  : "bg-white dark:hover:bg-white/10"
}`}
            >
              <h4 className="font-semibold text-lg text-slate-800 dark:text-white">
                {milestone.title}
              </h4>

              <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">
                Target ₹{milestone.amount}
              </p>

              <p
                className={`mt-2 font-medium ${
                  completed
  ? "text-green-600 dark:text-green-400"
  : "text-slate-400 dark:text-slate-500"
                }`}
              >
                {completed ? "Completed ✅" : "Not started"}
              </p>
            </div>
          );
        })}

      </div>
    ) : (
      <p className="text-gray-500">No milestones yet</p>
    )}

  </div>
)}

{/* {tab === "updates" && (
  <div className="mt-6 space-y-3">
    {updates.length === 0 && <p>No updates yet</p>}

    {updates.map((u) => (
      <div key={u.id} className="border p-3 rounded">
        <p className="text-sm text-gray-500">{u.time}</p>
        <p>{u.text}</p>
      </div>
    ))}
  </div>
)} */}

{tab === "updates" && (
  <div className="mt-6 space-y-4">

    {project?.updates?.length > 0 ? (
      project.updates.map((u, i) => (
        <div
          key={i}
          className="
          p-5 rounded-2xl
          bg-white/70 backdrop-blur-md border border-slate-200
          dark:bg-white/5 dark:border-white/10
          hover:shadow-xl hover:scale-[1.01]
          transition duration-300
          "
        >
          {/* creator message */}
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
            {u.content || "No content"}
          </p>

          {/* time */}
          {/* time */}
<p className="text-xs text-slate-400 mt-2">
  {new Date(new Date(u.created_at).getTime() + 5.5 * 60 * 60 * 1000)
    .toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    })}
</p>
        </div>
      ))
    ) : (
      <p className="text-slate-400 text-center">No updates yet</p>
    )}

  </div>
)}


{tab === "comments" && (
  <div className="mt-4 space-y-3">

    {/* input */}
    {user && (
      <>
        <textarea
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          className="w-full p-3 rounded-xl border bg-white dark:bg-slate-900 border-gray-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Write a comment..."
        />

        <button
          onClick={handlePostComment}
         className="mt-2 px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm"
        >
          Post
        </button>
      </>
    )}

    {!user && (
      <button
  onClick={() => navigate("/login")}
  className="text-sm bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded-md"
>
  Login to comment
</button>
    )}

    {/* comments list */}
    {comments.map((c) => (
      <div key={c.id} className="mb-4 p-4 rounded-xl 
           bg-white dark:bg-slate-900
           border border-gray-200 dark:border-slate-700
           shadow-sm hover:shadow-md transition">

        {/* NAME */}
        <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{c.user_name || c.user_email}</p>

        {/* EDIT MODE */}
        {editingId === c.id ? (
          <>
            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="w-full border p-2 rounded"
            />

            <button
              onClick={() => handleSaveEdit(c.id)}
              className="text-blue-600 mt-1"
            >
              Save
            </button>
          </>
        ) : (
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 leading-relaxed">
  {c.content}
</p>
        )}

        {/* OWNER BUTTONS */}
        {user && c.user_email === user.email && (
          <div className="flex gap-3 mt-1 text-sm">
            <button
              onClick={() => {
                setEditingId(c.id);
                setEditText(c.content);
              }}
              className="text-blue-600"
            >
              Edit
            </button>

            <button
              onClick={() => handleDeleteComment(c.id)}
              className="text-red-600"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    ))}
  </div>
)}
          
        
        </div>

        {/* RIGHT FUNDING */}
        {/* ================= RIGHT FUNDING CARD (MODERN) ================= */}
<div className="lg:sticky lg:top-24 h-fit">

  <div className="rounded-2xl p-7 shadow-xl backdrop-blur

bg-white/80 border border-slate-200

dark:bg-white/5 dark:border-white/10 dark:shadow-black/40

transition">

    {/* progress bar */}
    <div className="w-full h-2 rounded-full overflow-hidden mb-5
bg-slate-200 dark:bg-white/10">
      <div
        className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400"
        style={{ width: `${percent}%` }}
      />
    </div>

    {/* amount */}
    <h2 className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
      ₹{project.raised.toLocaleString()}
      <span className="text-slate-500 dark:text-slate-400 text-base font-normal">
        {" "}raised of ₹{project.goal.toLocaleString()}
      </span>
    </h2>

    {/* funded % */}
    <p className="text-emerald-600 dark:text-emerald-400">
      {percent}% funded
    </p>

    {/* stats */}
    <div className="flex justify-between mb-6 text-center">

      <div>
        <p className="text-2xl font-bold">{project.backers || 0}</p>
        <p className="text-slate-500 dark:text-slate-400">Backers</p>
      </div>

      <div>
        <p className="text-2xl font-bold">{daysLeft ?? 0}</p>
        <p className="text-slate-500 dark:text-slate-400">Days Left</p>
      </div>

    </div>

    {/* back button */}
    {/* <button
  onClick={handleFund}
  disabled={
    project.raised >= project.goal ||
    (project.deadline && new Date(project.deadline) < new Date())
  }
  className={`w-full py-3 rounded-full font-semibold text-white transition
    ${
      project.raised >= project.goal
        ? "bg-gray-400 cursor-not-allowed"
        : "bg-gradient-to-r from-indigo-500 to-emerald-400 hover:opacity-90"
    }
  `}
>
  {project.raised >= project.goal ? "Goal Reached 🎉" : "⚡ Back this project"}
</button> */}

<button
  disabled={daysLeft === 0 || project.raised >= project.goal}
  onClick={() => {
    setSelectedAmount("");
    setPaymentStep("method");
    setShowPayment(true);
    setSelectedUpi(null);
  }}
  className={`w-full py-3 rounded-full font-semibold text-white transition ${
    daysLeft === 0 || project.raised >= project.goal
      ? "bg-gray-400 cursor-not-allowed"
      : "bg-gradient-to-r from-indigo-500 to-emerald-400 hover:opacity-90"
  }`}
>
  {daysLeft === 0
    ? "⏳ Campaign Ended"
    : project.raised >= project.goal
    ? "🎉 Goal Reached"
    : "⚡ Back this project"}
    {daysLeft > 0 && daysLeft <= 3 && (
  <p className="text-red-500 text-sm mb-2 font-medium">
    ⚠️ Ending soon — only {daysLeft} days left
  </p>
)}
</button>

    {/* save + share */}
    <div className="flex gap-3 mt-4">

      {/* <button className="flex-1 py-2 rounded-full border hover:bg-gray-50">
        ♡ Save
      </button> */}

     <button
  onClick={() => setShowShare(true)}
 className="px-6 py-3 text-base font-semibold rounded-full flex items-center gap-2

bg-white/70 border border-slate-300 text-slate-700

dark:bg-white/5 dark:border-white/10 dark:text-white

hover:bg-white hover:shadow-lg hover:scale-105

dark:hover:bg-white/10 dark:hover:shadow-cyan-500/10

transition duration-300"
>
  🔗 Share
</button>

    </div>

    <p className="text-xs text-gray-400 dark:text-slate-500 mt-4 text-center">
      All payments are secure. You’ll only be charged if this project reaches its goal.
    </p>

  </div>
</div>
{showShare && (
  <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
    
    <div className="p-6 rounded-xl w-[320px] shadow-xl backdrop-blur

bg-white/90 border border-slate-200

dark:bg-slate-900 dark:border-slate-700 dark:shadow-black/40">

      <h3 className="font-semibold mb-3">Share Project</h3>

      <input
        value={`${window.location.origin}/project/${project.id}`}
        readOnly
       className="w-full p-2 rounded text-sm

bg-white border border-slate-300

dark:bg-slate-800 dark:border-slate-600 dark:text-white"
      />

      <div className="flex justify-end mt-3 gap-2">
        <button
          onClick={() => setShowShare(false)}
          className="w-full p-2 rounded text-sm

bg-white border border-slate-300

dark:bg-slate-800 dark:border-slate-600 dark:text-white"
        >
          Close
        </button>

        <button
          onClick={() => {
            navigator.clipboard.writeText(
              `${window.location.origin}/project/${project.id}`
            );
            alert("Link copied!");
          }}
          className="bg-blue-600 text-white px-3 py-1 rounded"
        >
          Copy
        </button>
      </div>

    </div>
  </div>
)}
{showPayment && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

    <div className="w-[420px] p-6 rounded-2xl shadow-2xl
bg-white text-gray-800
dark:bg-gradient-to-br dark:from-slate-900 dark:to-slate-800 dark:text-white
border border-gray-200 dark:border-slate-700">

      <h2 className="text-xl font-bold text-center mb-5">
        Fund this project
      </h2>

      {/* STEP 1 — METHOD */}
      {paymentStep === "method" && (
        <div className="space-y-3">
          <button
            onClick={() => setPaymentStep("upi")}
            className="w-full border p-3 rounded-lg transition
bg-gray-100 hover:bg-gray-200
dark:bg-slate-800 dark:hover:bg-slate-700
border-gray-300 dark:border-slate-600"
          >
            📱 Pay via UPI
          </button>

          <button
            onClick={() => setPaymentStep("card")}
           className="w-full border p-3 rounded-lg transition
bg-gray-100 hover:bg-gray-200
dark:bg-slate-800 dark:hover:bg-slate-700
border-gray-300 dark:border-slate-600"
          >
            💳 Pay via Card
          </button>
        </div>
      )}

      {/* STEP 2 — UPI APPS */}
      {paymentStep === "upi" && (
  <div className="grid grid-cols-3 gap-6 mt-4">
   {["gpay", "phonepe", "paytm", "bhim", "amazonpay"].map((app) => (
  <div
    key={app}
    onClick={() => {
      setSelectedUpi(app);
      setPaymentStep("bank");   // ⭐ IMPORTANT
    }}
    className={`cursor-pointer flex flex-col items-center justify-center p-3 rounded-xl transition-all
      ${selectedUpi === app
 ? "bg-indigo-100 dark:bg-indigo-600 scale-110 shadow-lg"
 : "bg-gray-100 dark:bg-slate-800 hover:scale-105"}`}
  >
    <img
      src={`/payments/upi/${app}.png`}
      alt={app}
      className="h-16 w-16 object-contain"
    />

    <span className="text-xs mt-1 text-gray-500 capitalize">
      {app}
    </span>
  </div>
))}
  </div>
)}
{/* ⭐ STEP — BANK SELECTION */}
{paymentStep === "bank" && (
  <div className="space-y-3 mt-4 max-h-[300px] overflow-y-auto">

    {[
      "State Bank of India",
      "Kotak Mahindra Bank",
      "Bank of Baroda",
      "Canara Bank",
      "Punjab National Bank",
      "HDFC Bank",
      "ICICI Bank",
      "Axis Bank"
    ].map((bank) => (
      <div
        key={bank}
        onClick={() => {
          setSelectedBank(bank);
          setPaymentStep("amount");
        }}
       className="flex items-center justify-between p-3 rounded-xl cursor-pointer transition
bg-gray-100 hover:bg-gray-200
dark:bg-slate-800 dark:hover:bg-slate-700"
      >
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold">
            🏦
          </div>

          <span className="font-medium">{bank}</span>
        </div>

        <span className="text-gray-400">›</span>
      </div>
    ))}
  </div>
)}

      {/* STEP 2 — CARD */}
      {paymentStep === "card" && (
        <div className="space-y-3">
          <input
  value={cardNumber}
  onChange={handleCardNumber}
  placeholder="Card Number"
  className="w-full p-3 rounded-lg bg-gray-900 text-white placeholder-gray-500 border border-gray-700 outline-none focus:outline-none focus:ring-0 focus:border-indigo-500 transition"
  name="no-autofill-card"
  autoComplete="off"
/>
          <div className="flex gap-2">
           <input
  value={expiry}
  onChange={handleExpiry}
  placeholder="MM/YY"
  className="w-full p-3 rounded-lg bg-gray-900 text-white placeholder-gray-500 border border-gray-700 outline-none focus:outline-none focus:ring-0 focus:border-indigo-500 transition"
autoComplete="off"
name="no-autofill-exp"
/>
            <input
  value={cvv}
  onChange={handleCvv}
  placeholder="CVV"
className="w-full p-3 rounded-lg bg-gray-900 text-white placeholder-gray-500 border border-gray-700 outline-none focus:outline-none focus:ring-0 focus:border-indigo-500 transition"
autoComplete="off"
name="no-autofill-cvv"
/>
{cardError && (
  <p className="text-red-500 text-sm mt-1">{cardError}</p>
)}
          </div>

          <button
  onClick={() => {
    if (!validateCard()) return;

    setPaymentStep("amount");
  }}
 className="w-full py-2 rounded-lg mt-3 font-semibold
bg-indigo-600 hover:bg-indigo-700
dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white"
>
  Continue
</button>
        </div>
      )}

      {/* STEP 3 — AMOUNT */}
      {paymentStep === "amount" && (
        <div className="space-y-3">
          <p className="text-xs text-gray-400 text-center">
  Paying via <span className="font-medium">{selectedUpi}</span> • {selectedBank}
</p>

          <input
            type="number"
            placeholder="Enter amount"
            value={selectedAmount}
            onChange={(e) => setSelectedAmount(e.target.value)}
            className="w-full border p-2 rounded
bg-gray-50 dark:bg-slate-800
border-gray-300 dark:border-slate-600
text-gray-900 dark:text-white"
          />

          <button
            onClick={handleConfirmPayment}
           className="w-full py-2 rounded font-semibold
bg-indigo-600 hover:bg-indigo-700
dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white"
          >
            Pay
          </button>
        </div>
      )}

      {/* STEP 4 — PROCESSING */}
      {paymentStep === "processing" && (
  <div className="flex flex-col items-center py-6">
    <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-3"></div>
    <p className="text-sm text-gray-500">Processing payment...</p>
  </div>
)}

      {/* STEP 5 — SUCCESS */}
      {paymentStep === "success" && (
  <div className="flex flex-col items-center py-6">

    {/* ✅ Animated tick */}
    <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-3 animate-bounce">
      <svg
        className="w-8 h-8 text-green-600"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    </div>

    <h3 className="text-lg font-semibold text-green-600">
      Payment Successful
    </h3>

    <p className="text-sm text-gray-500 mt-1">
      Thank you for supporting this project ❤️
    </p>

  </div>
)}
      {paymentStep !== "processing" && (
  <button
    className="w-full mt-4 text-gray-500 dark:text-gray-400"
    onClick={() => {
      setShowPayment(false);
      resetPaymentForm();
    }}
  >
    Cancel
  </button>
)}

    </div>
  </div>
)}


      </div>      
    </div>
  );

};
export default ProjectDetails;