import Image from "next/image"

const AuthNav = () => {
    return (
        <nav className="w-full bg-white border-b border-primary-border py-2 px-4 lg:px-14">
            <Image src={'/logo.svg'} alt="Logo" width={104} height={27.54} />
        </nav>
    )
}

export default AuthNav
