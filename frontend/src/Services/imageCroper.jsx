import React, { useState } from 'react';
import Cropper from 'react-easy-crop';
import { Dialog, Slider} from '@mui/material';
import {getCroppedImg} from '../utils/getCroppedImg'

const ImageCropperModal = ({ open, onClose, imageSrc, onCropSubmit }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null)

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleSubmit = async () => {
    try {
        const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
        setCroppedImage(croppedImage); // Set the preview of the cropped image
  
        if (onCropSubmit) {
          onCropSubmit(croppedImage); // Pass the cropped image back to the parent
        }
      } catch (error) {
        console.error('Error cropping image:', error);
      }
      onClose();
    };
  

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth={false}
      PaperProps={{
        style: {
          width: '400px',
          height: '400px',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        },
      }}
    >
      <div style={{ position: 'relative', width: '100%', height: '250px' }}>
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          aspect={4 / 3}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={onCropComplete}
        />
      </div>
      <Slider
        value={zoom}
        min={1}
        max={3}
        step={0.1}
        onChange={(e, zoom) => setZoom(zoom)}
        style={{ marginTop: '10px' }}
      />
      <div className="md:col-span-2 text-right">
                        <div className="flex justify-end space-x-3">
                          <div>
                            <button
                              className="bg-red-400 hover:bg-red-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                              type="button"
                              onClick={onClose}
                            >
                              Cancel
                            </button>
                          </div>
                          <div>
                            <button
                              className="bg-[#323232] hover:bg-gray-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                              type="submit"
                              onClick={handleSubmit}
                            >
                              Save
                            </button>
                          </div>
                        </div>
                      </div>
    </Dialog>
  );
};

export default ImageCropperModal;
