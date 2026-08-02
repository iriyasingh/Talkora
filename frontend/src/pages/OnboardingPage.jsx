import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2, Shuffle, MapPin, FileText, Globe2 } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import Avatar from "../components/common/Avatar";

const randomAvatarUrl = () =>
  `https://api.dicebear.com/9.x/avataaars/svg?seed=${Math.random().toString(36).slice(2)}`;

const OnboardingPage = () => {
  const { authUser, completeOnboarding, isOnboarding } = useAuthStore();
  const navigate = useNavigate();
  const [profilePicture, setProfilePic] = useState(authUser?.profilePicture || randomAvatarUrl());

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fullName: authUser?.fullName || "",
      bio: authUser?.bio || "",
      location: authUser?.location || "",
      nativeLanguage: authUser?.nativeLanguage || "",
      learningLanguage: authUser?.learningLanguage || "",
    },
  });

  const shuffleAvatar = () => setProfilePic(randomAvatarUrl());

  const onSubmit = async (data) => {
    const ok = await completeOnboarding({ ...data, profilePicture });
    if (ok) navigate("/home");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-base-200 px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-lg rounded-box border border-base-300 bg-base-100 p-6 shadow-sm sm:p-8"
      >
        <h1 className="text-2xl font-bold tracking-tight">Set up your profile</h1>
        <p className="mt-1 text-sm text-base-content/60">
          Tell us a bit about yourself so friends can find and recognize you.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 flex flex-col gap-4" noValidate>
          <div className="flex flex-col items-center gap-3">
            <Avatar src={profilePicture} name={authUser?.fullName} size="xl" />
            <button type="button" onClick={shuffleAvatar} className="btn btn-outline btn-sm gap-2">
              <Shuffle className="size-3.5" />
              Shuffle avatar
            </button>
          </div>

          <div className="form-control">
            <label className="label" htmlFor="fullName">
              <span className="label-text font-medium">Full name</span>
            </label>
            <input
              id="fullName"
              type="text"
              placeholder="Jane Doe"
              className="input input-bordered w-full"
              {...register("fullName", { required: "Full name is required" })}
            />
            {errors.fullName && <span className="mt-1 text-xs text-error">{errors.fullName.message}</span>}
          </div>

          <div className="form-control">
            <label className="label" htmlFor="bio">
              <span className="label-text font-medium">Bio</span>
            </label>
            <label className="textarea textarea-bordered flex w-full items-start gap-2">
              <FileText className="mt-1 size-4 shrink-0 text-base-content/40" />
              <textarea
                id="bio"
                rows={3}
                placeholder="A short intro about you"
                className="grow resize-none bg-transparent outline-none"
                {...register("bio", { maxLength: { value: 200, message: "Keep it under 200 characters" } })}
              />
            </label>
            {errors.bio && <span className="mt-1 text-xs text-error">{errors.bio.message}</span>}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="form-control">
              <label className="label" htmlFor="location">
                <span className="label-text font-medium">Location</span>
              </label>
              <label className="input input-bordered flex w-full items-center gap-2">
                <MapPin className="size-4 text-base-content/40" />
                <input
                  id="location"
                  type="text"
                  placeholder="City, Country"
                  className="grow"
                  {...register("location")}
                />
              </label>
            </div>

            <div className="form-control">
              <label className="label" htmlFor="nativeLanguage">
                <span className="label-text font-medium">Native language</span>
              </label>
              <label className="input input-bordered flex w-full items-center gap-2">
                <Globe2 className="size-4 text-base-content/40" />
                <input
                  id="nativeLanguage"
                  type="text"
                  placeholder="English"
                  className="grow"
                  {...register("nativeLanguage")}
                />
              </label>
            </div>
          </div>

           <div className="form-control">
              <label className="label" htmlFor="learningLanguage">
                <span className="label-text font-medium">Learning language</span>
              </label>
              <label className="input input-bordered flex w-full items-center gap-2">
                <Globe2 className="size-4 text-base-content/40" />
                <input
                  id="learningLanguage"
                  type="text"
                  placeholder="Spanish"
                  className="grow"
                  {...register("learningLanguage")}
                />
              </label>
            </div>

          <button type="submit" disabled={isOnboarding} className="btn btn-primary mt-2 w-full">
            {isOnboarding ? <Loader2 className="size-4 animate-spin" /> : "Complete setup"}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default OnboardingPage;
