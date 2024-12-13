import dbConnect from '@/lib/dbConnect';
import UserModel from '@/models/User';

export async function POST(request: Request) {
  // Connect to the database
  await dbConnect();

  try {
    const { username, code } = await request.json();
    const decodedUsername = decodeURIComponent(username).toLowerCase();
    
    console.log('Debug - Looking for:', { username: decodedUsername, code });
    
    // Add this debug query to see all users
    const allUsers = await UserModel.find({}, 'username email isVerified verifyCode');
    console.log('All users in database:', JSON.stringify(allUsers, null, 2));

    const user = await UserModel.findOne({ 
      username: decodedUsername
    });

    if (!user) {
      return Response.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // Check verification status after finding user
    if (user.isVerified) {
      return Response.json(
        { success: false, message: 'User is already verified' },
        { status: 400 }
      );
    }

    // Check if the code is correct and not expired
    const isCodeValid = user.verifyCode === code;
    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

    if (isCodeValid && isCodeNotExpired) {
      // Update the user's verification status
      user.isVerified = true;
      await user.save();

      return Response.json(
        { success: true, message: 'Account verified successfully' },
        { status: 200 }
      );
    } else if (!isCodeNotExpired) {
      // Code has expired
      return Response.json(
        {
          success: false,
          message:
            'Verification code has expired. Please sign up again to get a new code.',
        },
        { status: 400 }
      );
    } else {
      // Code is incorrect
      return Response.json(
        { success: false, message: 'Incorrect verification code' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error verifying user:', error);
    return Response.json(
      { success: false, message: 'Error verifying user' },
      { status: 500 }
    );
  }
}