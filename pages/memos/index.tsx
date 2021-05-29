import Head from 'next/head'
import AppHead from '../../components/appHead';
import Canvas from '../../components/canvas'

export default function Memos() {
    return (
        <>
            <AppHead headMessage="Memos" />
            
            <header>
            
                <Canvas />
            </header>
          <div>
            <h1>hoge</h1>
            </div>
        </>
    )
}
