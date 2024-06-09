import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const useUpdateUserProfile = () => {
	const queryClient = useQueryClient();

	const { mutateAsync: updateProfile, isPending: isUpdatingProfile } = useMutation({
		mutationFn: async (formData) => {
			if (Array.isArray(formData.fullname)) {
				formData.fullname = formData.fullname.join(', '); // Anda dapat mengubah pemisah sesuai kebutuhan
			}
			if (Array.isArray(formData.username)) {
				formData.username = formData.username.join(', '); // Anda dapat mengubah pemisah sesuai kebutuhan
			}
			if (Array.isArray(formData.bio)) {
				formData.bio = formData.bio.join(', '); // Anda dapat mengubah pemisah sesuai kebutuhan
			}
			if (Array.isArray(formData.link)) {
				formData.link = formData.link.join(', '); // Anda dapat mengubah pemisah sesuai kebutuhan
			}
			try {
				const res = await fetch(`/api/users/update`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(formData),
				});
				const data = await res.json();
				if (!res.ok) {
					throw new Error(data.error || "Something went wrong");
				}
				return data;
			} catch (error) {
				throw new Error(error.message);
			}
		},
		onSuccess: () => {
			toast.success("Profile updated successfully");
			Promise.all([
				queryClient.invalidateQueries({ queryKey: ["authUser"] }),
				queryClient.invalidateQueries({ queryKey: ["userProfile"] }),
			]);
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});

	return { updateProfile, isUpdatingProfile };
};

export default useUpdateUserProfile;