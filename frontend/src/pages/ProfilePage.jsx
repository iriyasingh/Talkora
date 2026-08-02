import { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Loader2, Shuffle, MapPin, FileText, Globe2, Mail, Save } from "lucide-react";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/useAuthStore";
import Avatar from "../components/common/Avatar";

const randomAvatarUrl = () =>
  `https://api.dicebear.com/9.x/avataaars/svg?seed=${Math.random().toString(36).slice(2)}`;

const ProfilePage = () => {
  const { authUser, completeOnboarding, isOnboarding } = useAuthStore();
  const [profilePicture, setProfilePic] = useState(authUser?.profilePicture || "");
  const [isDirty, setIsDirty] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty: formIsDirty },
  } = useForm({
    defaultValues: {
      fullName: authUser?.fullName || "",
      bio: authUser?.bio || "",
      location: authUser?.location || "",
      nativeLanguage: authUser?.nativeLanguage || "",
    },
  });

  const shuffleAvatar = () => {
    setProfilePic(randomAvatarUrl());
    setIsDirty(true);
  };

  const onSubmit = async (data) => {
    const ok = await completeOnboarding({ ...data, profilePicture });
    if (ok) {
      setIsDirty(false);
      toast.success("Profile updated");
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold tracking-tight">Your profile</h2>
        <p className="mt-1 text-sm text-base-content/60">
          This is how others see you across Talkora.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="rounded-box border border-base-300 bg-base-100 p-6 sm:p-8"
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          onChange={() => setIsDirty(true)}
          className="flex flex-col gap-5"
          noValidate
        >
          <div className="flex flex-col items-center gap-3 border-b border-base-300 pb-6">
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
              className="input input-bordered w-full"
              {...register("fullName", { required: "Full name is required" })}
            />
            {errors.fullName && <span className="mt-1 text-xs text-error">{errors.fullName.message}</span>}
          </div>

          <div className="form-control">
            <label className="label" htmlFor="email">
              <span className="label-text font-medium">Email</span>
            </label>
            <label className="input input-bordered flex w-full items-center gap-2 opacity-60">
              <Mail className="size-4 text-base-content/40" />
              <input id="email" type="email" value={authUser?.email || ""} disabled className="grow" />
            </label>
            <span className="mt-1 text-xs text-base-content/40">Email can't be changed</span>
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
                <input id="location" type="text" className="grow" {...register("location")} />
              </label>
            </div>

            <div className="form-control">
              <label className="label" htmlFor="nativeLanguage">
                <span className="label-text font-medium">Native language</span>
              </label>
              <label className="input input-bordered flex w-full items-center gap-2">
                <Globe2 className="size-4 text-base-content/40" />
                <input id="nativeLanguage" type="text" className="grow" {...register("nativeLanguage")} />
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={isOnboarding || !(isDirty || formIsDirty)}
            className="btn btn-primary mt-2 w-full gap-2 sm:w-auto sm:self-end"
          >
            {isOnboarding ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
            Save changes
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default ProfilePage;
