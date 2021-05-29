import Head from 'next/head'

type Props = {
    headMessage: string
}

export default function AppHead(props: Props) {
    return (
        <Head>
            <title>{ props.headMessage }</title>
            <meta name="description" content="freemo" />
            <link rel="icon" href="/favicon.ico" />
        </Head>
    )
}