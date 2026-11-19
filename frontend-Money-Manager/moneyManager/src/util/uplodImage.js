import { Endpoints } from "./apiEndpoints";

const CLOUDINARY_PRESET = "money-Manager";

const uploadFile = async (image) => {
  const formData = new FormData();

  formData.append("file", image);
  formData.append("upload_preset", CLOUDINARY_PRESET);

  try {
    const response = await fetch(Endpoints.UPLOAD_IMAGE, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();

      throw new Error(
        `Cloudinary upload failed: ${error.error.message || response.statusText}`,
      );
    }

    const data = await response.json();

    console.log(data.secure_url);
    return data.secure_url;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export default uploadFile;
