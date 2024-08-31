import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/options';
import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';
import { User } from 'next-auth';


export async function DELETE(request: Request, {prams}:{prams: {messageid:string}}) {
    await dbConnect()

    const messageid = prams.messageid
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;
    if (!session || !session.user) {
        return Response.json(
            { success: false, message: 'Not authenticated' },
            { status: 401 }
        );
    }
    try {
        const updateResult =  await UserModel.updateOne(
            {_id: user._id},
            {$pull: {messages: {_id: messageid}}}
        )
        if (updateResult.modifiedCount == 0) {
            return Response.json(
                { success: false, message: 'Message not found or already deleted' },
                { status: 404 }
            );
        }

        return Response.json(
            { success: true, message: 'Message Deleted' },
            { status: 200 }
        );
    } catch (error) {
        console.log("Error is delete messages route", error)
        return Response.json(
            { success: false, message: 'Error deleting messages' },
            { status: 500 }
        );
    }

   
    


}