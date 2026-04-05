/**
 * Reusable client-side function to upload a file directly to Cloudinary.
 * @param {File | null | undefined} file - The file object from an <input type="file">.
 * @param {string} cloudName - Your Cloudinary cloud name.
 * @param {string} uploadPreset - Your unsigned upload preset name.
 * @returns {Promise<string | null>} The secure URL of the uploaded image.
 */
type CloudinaryUploadResponse = {
    secure_url?: string;
};

export const uploadImageClientSide = async (
    file: File | null | undefined,
    cloudName = 'dwduymu1l',
    uploadPreset = 'my_preset'
): Promise<string | null> => {
    if (!file) return null;

    const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
    const formData = new FormData();

    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);

    try {
        const response = await fetch(url, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`Upload failed with status: ${response.status}`);
        }

        const data = (await response.json()) as CloudinaryUploadResponse;

        if (!data.secure_url) {
            throw new Error('Upload succeeded but no secure_url was returned.');
        }

        return data.secure_url;
    } catch (error) {
        console.error('Error uploading image to Cloudinary:', error);
        throw error;
    }
};