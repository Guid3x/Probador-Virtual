export const en = {
  header: {
    title: 'AI Virtual Try-On Studio',
    subtitle: 'Upload a photo of yourself and a garment to generate realistic try-on images.',
  },
  uploader: {
    personLabel: '1. Upload Your Photo',
    personDescription: 'A full-body photo works best.',
    clothingLabel: '2. Upload Garment',
    clothingDescription: 'A single clothing item on a plain background.',
    yourPhoto: 'Your Photo',
    personAlt: 'Person',
    clothingAlt: 'Garment',
    previewAlt: 'Preview',
    changeImage: 'Change Image',
    clickToUpload: 'Click to upload',
    dragAndDrop: 'or drag and drop',
    paste: '(or paste from clipboard)',
  },
  buttons: {
    generate: 'Generate My Look',
    createAnother: 'Create Another Look',
  },
  status: {
    preparing: 'Preparing images for the virtual try-on...',
    generating: 'Generating Pose {{index}} of {{total}}: {{pose}}...',
    finalizing: 'Finalizing your new looks...',
    patience: 'This may take a few moments. Please wait...',
    converting: 'Converting images into a format the AI understands...',
  },
  results: {
    title: 'Your Virtual Try-On Results',
    pose: 'Pose',
    ariaLabel: 'View pose large',
    poseAlt: 'Generated pose',
  },
  modal: {
    alt: 'Enlarged view',
    closeAriaLabel: 'Close enlarged view',
  },
  error: {
    title: 'Error',
    missingImages: 'Please upload both the person and garment images.',
    generationFailed: 'Generation failed',
    unknown: 'An unknown error occurred during image generation.',
  },
  footer: {
    copyright: 'Virtual Try-On Studio. Powered by Google Gemini.',
  },
};
