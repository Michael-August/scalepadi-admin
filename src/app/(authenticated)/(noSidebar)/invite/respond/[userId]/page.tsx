"use client"

import { Button } from "@/components/ui/button";
import { useAcceptDeclineMatch } from "@/hooks/useAuth";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

const AcceptDeclineInvitePage = () => {

    const { userId } = useParams()
    const router = useRouter()

    const { acceptOrDecline, isPending } = useAcceptDeclineMatch()

    const handleAcceptDecline = (action: 'accepted' | 'declined', userId: string) => {
        if (!userId) {
            return;
        }
        acceptOrDecline({ inviteStatus: action, userId}, {
            onSuccess: () => {
                toast.success(`Invite ${action} successfully`)
                if (action === 'accepted') {
                    toast.info('Please sign in to continue')
                    router.push('/signin')
                } else {
                    toast.error('You have declined the invite')
                    router.push('/')
                }
            },
            onError: () => {
                toast.error(`Error ${action === 'accepted' ? 'accepting' : 'declining'} invite`)
            }
        });
    }

    return (
        <div className="flex flex-col items-center min-h-screen py-6 px-4">
            <div className="max-w-md w-full bg-white shadow-lg rounded-2xl p-6 flex flex-col gap-4 text-center">
                <h1 className="text-2xl font-bold">You’ve been invited!</h1>
                <p className="text-gray-600">
                    Scalepadi admin has invited you to join <span className="font-medium">Scalepadi team</span>.
                </p>

                <div className="flex gap-4 justify-center mt-6">
                    <Button disabled={isPending} onClick={() => handleAcceptDecline("accepted", userId as string)} className="bg-primary text-white w-fit text-xs rounded-[14px] px-4 py-6">{isPending ? 'Accepting...' : 'Accept'}</Button>
                    <Button disabled={isPending}
                        variant={'destructive'}
                        onClick={() => handleAcceptDecline("declined", userId as string)} className="w-fit text-xs rounded-[14px] px-4 py-6"
                    >
                        {isPending ? 'Declining...' : 'Decline'}
                    </Button>
                </div>
            </div>
        </div>
    )
};

export default AcceptDeclineInvitePage;