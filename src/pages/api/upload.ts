import type { APIRoute } from 'astro';
import fs from 'node:fs/promises';
import path from 'node:path';
import { getSessionFromCookie } from '../../lib/auth/session';
import { isLoggedIn } from '../../lib/auth/auth';

// Helper function to ensure directory exists
async function ensureDirectoryExists(dirPath: string): Promise<void> {
  try {
    await fs.access(dirPath);
  } catch (error) {
    // Directory doesn't exist, create it
    await fs.mkdir(dirPath, { recursive: true });
  }
}

export const POST: APIRoute = async ({ request }) => {
  // Check authentication
  const session = getSessionFromCookie(request);
  if (!session || !isLoggedIn(session)) {
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: 'Unauthorized' 
      }),
      { 
        status: 401,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }

  try {
    // Get the uploaded file from the request
    const formData = await request.formData();
    
    // Get the file and destination folder from the form data
    const file = formData.get('file');
    const destinationValue = formData.get('destination');
    const destination = typeof destinationValue === 'string' ? destinationValue : 'uploads';
    
    // Validate file
    if (!file || !(file instanceof File)) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'No file uploaded' 
        }),
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }
    
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
    if (!allowedTypes.includes(file.type)) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Invalid file type. Only JPEG, PNG, GIF, WEBP, and SVG files are allowed.' 
        }),
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }
    
    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'File too large. Maximum file size is 5MB.' 
        }),
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }
    
    // Create a safe filename
    const originalName = file.name;
    const extension = path.extname(originalName);
    const baseName = path.basename(originalName, extension);
    
    // Create a unique filename with timestamp
    const timestamp = Date.now();
    const fileName = `${baseName.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-${timestamp}${extension}`;
    
    // Create directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), 'public', destination);
    await ensureDirectoryExists(uploadDir);
    
    // Write the file
    const filePath = path.join(uploadDir, fileName);
    const fileData = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(filePath, fileData);
    
    // Return success with the file URL
    const fileUrl = `/${destination}/${fileName}`;
    return new Response(
      JSON.stringify({ 
        success: true, 
        fileUrl,
        fileName,
        message: 'File uploaded successfully' 
      }),
      { 
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    
  } catch (error) {
    console.error('Error uploading file:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: 'File upload failed' 
      }),
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
};
