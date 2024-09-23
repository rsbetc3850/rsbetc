import Link from 'next/link';
import { SocialIcon } from 'react-social-icons';
import { siteLinks, policyLinks, socialMediaLinks } from '../data/config';

export default function Footer() {
    return (
        <div className="border-t-2 border-zinc-700 bg-zinc-900 bg-opacity-75 flex flex-col items-center px-1 py-2 relative z-10">
            <div className="px-6 mx-6 flex flex-col items-center w-full md:flex-row md:justify-center md:items-start w-full">
                <div className="text-lg w-full text-center text-zinc-200 mb-4 md:w-3/12 text-center md:text-left">
                    <p className="italic pb-2 mb-2 font-bold">You Can Find It Here!</p>
                    <p>Batteries Etc</p>
                </div>
                
                <div className="w-full flex flex-row justify-center text-zinc-400 mb-4 md:w-6/12 flex-row justify-center md:justify-between  md:pt-1">
                    <div className="w-1/2 text-center px-2  md:w-1/2  md:text-right md:mb-0">
                        <h4 className="pb-1 text-zinc-200">Navigation</h4>
                        <ul>
                            {siteLinks.map((link, index) => (
                                <li key={index}><Link href={link.href}>{link.label}</Link></li>
                            ))}
                        </ul>
                    </div>
                    <div className="w-1/2 text-center px-2  md:w-1/2  md:text-right md:mb-0">
                        <h4 className="pb-1 text-zinc-200">Policies</h4>
                        <ul>
                            {policyLinks.map((link, index) => (
                                <li key={index}><Link href={link.href}>{link.label}</Link></li>
                            ))}
                        </ul>
                    </div>
                </div>
                
                <div className="w-full text-center text-zinc-400 mb-4 md:w-3/12 md:text-right md:pt-4 md:pt-1 md:flex md:flex-col md:justify-end items-center md:items-end">
                    <h4 className="pb-1 text-zinc-200">Follow Us On Social Media</h4>
                    <ul className="flex flex-row justify-center w-full mt-2 md:justify-end md:w-auto md:mt-8">
                        {socialMediaLinks.map((link, index) => (
                            <li key={index} className="px-1">
                                <SocialIcon style={{ height: 32, width: 32 }} target="_blank" url={link.url} />
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <div className="mt-2 w-100 text-md font-bold uppercase text-zinc-200 items-center">Copyright © 2024 RSBETC. All Rights Reserved.</div>
        </div>
    );
}