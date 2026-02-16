import type { Database } from '~/types/database.types'

// Use the generated types for the UI return
export type Profile = {
    userName: string | null
    email: string | null
    imageUrl: string | null
}

export const useProfile = () => {
    const supabase = useSupabaseClient<Database>();
    const user = useSupabaseUser();
    const profile = ref<Profile | null>(null);

    const fetchProfile = async () => {
        if (!user.value?.email) return;

        const { data, error } = await supabase
            .from('profiles')
            .select('user_name, email, image_url')
            .eq('email', user.value.email)
            .single();

        if (!error && data) {
            profile.value = {
                userName: data.user_name,
                email: data.email,
                imageUrl: data.image_url
            };
        }
    };

    watch(user, () => fetchProfile(), { immediate: true });

    return { profile: readonly(profile), fetchProfile };
};