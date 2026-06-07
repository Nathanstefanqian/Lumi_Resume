import request from './request';

/**
 * 获取 OSS 预签名上传 URL
 */
export const getPresignedUrl = (filename, folder = 'uploads') => {
  return request.get('/common/upload/presigned-url', {
    params: { filename, folder },
  });
};

/**
 * 前端直传 OSS
 */
export const uploadFileDirectly = async (file, folder = 'uploads') => {
  try {
    // 1. 获取预签名 URL
    // 返回格式参考 lumi-be: { uploadUrl: string, publicUrl: string }
    const { uploadUrl, publicUrl } = await getPresignedUrl(file.name, folder);

    // 2. 直接 PUT 到 OSS
    const response = await fetch(uploadUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': 'application/octet-stream', // 必须与后端签名时的 Content-Type 严格一致
      },
    });

    if (!response.ok) {
      throw new Error(`OSS Direct Upload Failed: ${response.statusText}`);
    }

    return { url: publicUrl, success: true };
  } catch (error) {
    console.error('OSS upload error:', error);
    throw error;
  }
};
