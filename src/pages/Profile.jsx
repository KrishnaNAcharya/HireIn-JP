import React, { useState, useEffect } from "react";
import { Avatar } from "@material-tailwind/react";
import { MdEdit } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { db, storage } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const ProfilePage = () => {
  const [profilePicture, setProfilePicture] = useState(
    null
  );
  const auth = getAuth();
  const [userData, setUserData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [description, setDescription] = useState("");
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState("");
  const navigate = useNavigate();
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [resumeURL, setResumeURL] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        onAuthStateChanged(auth, async (user) => {
          if (user) {
            const userRef = doc(db, "users", user.uid);
            const userSnapshot = await getDoc(userRef);

            if (userSnapshot.exists()) {
              const userData = userSnapshot.data();
              setUserData(userData);
              setDescription(userData.description || "");
              setSkills(userData.skills || []);
              setProfilePicture(userData.profilePicture || "https://docs.material-tailwind.com/img/face-2.jpg");
              setFullName(userData.fullName || "");
              setEmail(userData.email || "");
              setPhoneNumber(userData.phoneNumber || "");
              setResumeURL(userData.resume || "");
            } else {
              console.log("No user data found");
            }
          } else {
            console.log("User is not authenticated");
          }
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [auth]);

  const handleLogout = () => {
    signOut(auth);
    navigate("/");
  };

  const handleProfilePictureUpload = (event) => {
    const file = event.target.files[0];
    setProfilePicture(URL.createObjectURL(file));
  };

  const handleEditModeToggle = () => {
    setEditMode(!editMode);
  };

  const handleSaveChanges = async (event) => {
    event.preventDefault();

    try {
      const userRef = doc(db, "users", auth.currentUser.uid);

      let resumeURL = userData?.resume || null;
      if (resume) {
        const resumeStorageRef = ref(
          storage,
          `resumes/${auth.currentUser.uid}/${resume.name}`
        );
        await uploadBytes(resumeStorageRef, resume);
        resumeURL = await getDownloadURL(resumeStorageRef);
      }

      let profilePictureURL = profilePicture;
      if (typeof profilePicture !== "string") {
        const profilePictureStorageRef = ref(
          storage,
          `profilePictures/${auth.currentUser.uid}/profilePicture`
        );
        await uploadBytes(profilePictureStorageRef, profilePicture);
        profilePictureURL = await getDownloadURL(profilePictureStorageRef);
      }

      await updateDoc(userRef, {
        description,
        skills,
        resume: resumeURL,
        profilePicture: profilePictureURL,
        fullName,
        email,
        phoneNumber,
      });

      setEditMode(false);
      setResumeURL(resumeURL);
    } catch (error) {
      console.error("Error saving changes:", error);
    }
  };

  const handleResumeUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setResume(file);
    }
  };

  const handleAddSkill = () => {
    if (newSkill.trim() !== "") {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
  };

  const openResumeURL = () => {
    if (resumeURL) {
      window.open(resumeURL, "_blank");
    }
  };

  return (
    <div className="w-full min-h-screen py-8">
      {/* Background Blobs */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-50">
        <div className="fixed w-[250px] md:w-[500px] h-[250px] md:h-[500px] rounded-full bg-blue-300/40 blur-[100px] -left-[5vw] top-[40vh] animate-pulse"></div>
        <div className="fixed w-[200px] md:w-[400px] h-[250px] md:h-[500px] rounded-full bg-purple-300/40 blur-[100px] right-[0vw] bottom-[-30vh] animate-pulse"></div>
      </div>

      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col lg:flex-row justify-center gap-8">
          {/* Left Column - Profile Info */}
          <div className="w-full lg:w-[500px] bg-white/10 backdrop-filter backdrop-blur-lg rounded-lg p-8 relative">
            {/* Edit/Save Buttons */}
            <div className="absolute top-4 right-4 flex gap-4">
              {editMode && (
                <button
                  onClick={handleSaveChanges}
                  className="px-4 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors duration-200"
                >
                  Save Changes
                </button>
              )}
              <button
                className="bg-purple-600 rounded-full p-2 cursor-pointer hover:bg-purple-700 transition-colors duration-200"
                onClick={handleEditModeToggle}
              >
                <MdEdit className={`w-5 h-5 text-white ${editMode ? "rotate-45" : ""}`} />
              </button>
            </div>

            {/* Profile Picture */}
            <div className="flex justify-center mb-8">
              <label htmlFor="profilePicture" className="relative cursor-pointer">
                <Avatar src={profilePicture} alt="Profile Picture" size="xxl" className="w-40 h-40" />
                {editMode && (
                  <div className="absolute bottom-0 right-0 bg-gray-300 rounded-full p-2">
                    <svg className="w-6 h-6 text-gray-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
                <input type="file" id="profilePicture" accept="image/*" className="hidden" onChange={handleProfilePictureUpload} disabled={!editMode} />
              </label>
            </div>

            {/* Description and Skills */}
            <div className="space-y-6">
              <div className="mb-4">
                <label htmlFor="description" className="text-gray-300 font-bold">
                  Description
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={!editMode}
                  className={`w-full px-3 py-2 border bg-transparent text-white ${
                    editMode ? "border-blue-500" : "border-gray-300"
                  } rounded-md`}
                  rows={4}
                />
              </div>
              <div className="mb-4">
                <label htmlFor="skills" className="text-gray-300 font-bold">
                  Skills
                </label>
                <div className="flex items-center">
                  <input
                    type="text"
                    id="newSkill"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    disabled={!editMode}
                    placeholder="Add a new skill"
                    className={`w-full rounded-full px-3 py-2 border bg-transparent text-white ${
                      editMode ? "border-blue-500" : "border-transparent"
                    } rounded-md`}
                  />
                  {editMode && (
                    <button
                      onClick={handleAddSkill}
                      className="ml-2 px-3 py-2 bg-blue-500 text-white rounded-full"
                    >
                      Add
                    </button>
                  )}
                </div>
                <div className="mt-2 flex flex-wrap">
                  {skills.map((skill, index) => (
                    <div
                      key={index}
                      className="bg-gray-300 text-gray-800 px-3 py-1 rounded-full mr-2 mb-2 flex items-center"
                    >
                      <span>{skill}</span>
                      {editMode && (
                        <button
                          onClick={() => handleRemoveSkill(skill)}
                          className="ml-2 text-gray-600 hover:text-gray-800 focus:outline-none"
                        >
                          &times;
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Personal Info and Resume */}
          <div className="flex flex-col gap-8 w-full lg:w-[400px]">
            {/* Personal Info Card */}
            <div className="bg-white/10 backdrop-filter backdrop-blur-lg rounded-lg p-8">
              <div className="space-y-4">
                {/* Personal Info Fields */}
                <div className="space-y-4">
                  <div className="mb-4 w-64">
                    <div className="flex items-center justify-between mb-2">
                      <label htmlFor="fullName" className="text-gray-300 font-bold">
                        Name
                      </label>
                    </div>
                    <input
                      type="text"
                      id="fullName"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      disabled={!editMode}
                      className={`w-full px-3 py-2 border bg-transparent text-white ${
                        editMode ? "border-blue-500" : "border-gray-300"
                      } rounded-full`}
                    />
                  </div>
                  <div className="mb-4 w-64">
                    <div className="flex items-center justify-between mb-2 bg-transparent">
                      <label htmlFor="email" className="text-gray-300 font-bold">
                        Email
                      </label>
                    </div>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={!editMode}
                      className={`w-full px-3 py-2 border bg-transparent text-white ${
                        editMode ? "border-blue-500" : "border-gray-300"
                      } rounded-full`}
                    />
                  </div>
                  <div className="mb-4 w-64">
                    <div className="flex items-center justify-between mb-2 bg-transparent">
                      <label htmlFor="phoneNumber" className="text-gray-300 font-bold">
                        Phone Number
                      </label>
                    </div>
                    <input
                      type="tel"
                      id="phoneNumber"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      disabled={!editMode}
                      className={`w-full px-3 py-2 border bg-transparent text-white ${
                        editMode ? "border-blue-500" : "border-gray-300"
                      } rounded-full`}
                    />
                  </div>
                </div>
                <p
                  onClick={handleLogout}
                  className="text-blue-600 mt-8 hover:text-blue-800 transition duration-200 ease-in-out cursor-pointer text-center"
                >
                  Sign out
                </p>
              </div>
            </div>

            {/* Resume Upload Card */}
            <div className="bg-white/10 backdrop-filter backdrop-blur-lg rounded-lg p-8">
              <h3 className="text-gray-300 font-bold mb-4">Upload Resume</h3>
              <div className="space-y-4">
                <input
                  type="file"
                  id="resume"
                  accept=".pdf,.doc,.docx"
                  onChange={handleResumeUpload}
                  disabled={!editMode}
                  className={`w-full px-3 py-2 border text-white ${
                    editMode ? "border-blue-500" : "border-gray-300"
                  } rounded-full`}
                />
                {(resumeURL || resume) && (
                  <div className="space-y-2">
                    {resumeURL && (
                      <button onClick={openResumeURL} className="w-full px-3 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700">
                        View Current Resume
                      </button>
                    )}
                    {resume && (
                      <p className="text-green-400 text-sm text-center">
                        ✓ New resume selected. Save changes to update.
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;