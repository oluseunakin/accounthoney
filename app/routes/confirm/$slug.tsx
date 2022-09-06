import type { LoaderFunction} from "@remix-run/node";
import { json } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react";

export const loader:LoaderFunction = async ({params}) => {

    return json({slug : params.slug})
}

export default function ConfirmSlug() {    
    const {slug} = useLoaderData<{slug : string}>()
    return <div>{slug}</div>
}