import { ConnectButton,  } from "web3uikit"
import Link from "next/link"

export default function Header() {
    return (
        <nav className="p-5 border-b-2 flex flex-row justify-between items-center">
            <h1 className="py-4 px-4 font-bold text-3xl text-blue-300">Trivia 4 Ether</h1>
            <div className="flex flex-row items-center">
                <Link className="mr-4 p-6 text-blue-300" href="/">Home</Link>
                <Link className="mr-4 p-6 text-blue-300" href="/trivia-page">Trivia</Link>
                <Link className="mr-4 p-6 text-blue-300" href="/admin-dashboard">Dashboard</Link>
                <ConnectButton moralisAuth={false} />
            </div>
        </nav>
    )
}

/* 
    
*/
