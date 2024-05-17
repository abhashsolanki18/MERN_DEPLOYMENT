import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchImages } from "../../react/Actions";

const DisplayImage = () => {
  const dispatch = useDispatch();
  const images = useSelector((state) => state.images);
  const isLoading = useSelector((state) => state.loading);

  useEffect(() => {
    dispatch(fetchImages());
  }, [dispatch]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Cloudinary Image Gallery</h1>

      {isLoading ? (
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {images.map((image) => (
            <div
              key={image.public_id}
              className="rounded-lg overflow-hidden shadow-lg bg-white"
            >
              <img
                src={image.secure_url}
                alt={image.public_id}
                className="object-contain w-full h-48 sm:h-56 md:h-64 lg:h-72 xl:h-80"
              />
              <div className="p-4">
                <p className="text-lg font-semibold">{image.public_id.split("/").pop()}</p>
                <p className="text-sm text-gray-600 mb-2">Views: {image.views || 0}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DisplayImage;
