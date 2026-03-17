import ResetPassword from "@/components/modules/ResetPassword/ResetPassword";

export default async function ResetPasswordPage({searchParams}: {searchParams: Promise<{token: string}>}) {

    const { token } = await searchParams;

    return (
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-md">
                <ResetPassword token={token} />
            </div>
        </div>
    )
}
