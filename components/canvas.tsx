import React, { MouseEvent, useEffect, useState, useRef } from "react";
import styled from 'styled-components';
import NormalButton from "./button";

export default function Canvas(this: any) {
    const [isDrawing, setDrawing] = useState(false);
    const [isClearEnabled, setClearEnabled] = useState(false);
    const [isClearing, setClearing] = useState(false);
    const [x, setX] = useState(0);
    const [y, setY] = useState(0);

    // スタックしておく最大回数。キャンバスの大きさの都合などに合わせて調整したら良いです。
    const STACK_MAX_SIZE = 5;
    // スタックデータ保存用の配列
    let undoDataStack: Array<ImageData> = [];
    let redoDataStack: Array<ImageData> = [];
    let canvas: HTMLCanvasElement | null= null;
    let context: CanvasRenderingContext2D | null = null;

    const canvasRef = useRef(null);
    const getContext = (): CanvasRenderingContext2D => {
        const canvas: any = canvasRef.current;

        return canvas.getContext('2d');
    };

    // // []を第二引数にすることで、初回のみの実行になる
    // useEffect(() => {
    //     context = getContext();
    // }, []);

    // useEffect(() => {
    //     // onMouseMove.bind(this)
    //     // onMouseDown.bind(this)
    // }, []);

    function onMouseMove(e: MouseEvent<HTMLCanvasElement>) {
        const context = getContext();
        if (isDrawing) {
            drawLine(context, x, y, e.clientX, e.clientY);
        } else if (isClearing) {
            clearLine(context, x, y, e.clientX, e.clientY);
        }
        setX(e.clientX);
        setY(e.clientY);
    }
 
    const onMouseDown = (e: MouseEvent<HTMLCanvasElement>) => {
        if (!isClearEnabled) {
            beforeDraw();
            setDrawing(true);
        } else {
            setClearing(true);
        }
        setX(e.clientX);
        setY(e.clientY);
    };

    const onMouseUp = (e: MouseEvent<HTMLCanvasElement>) => {
        const context = getContext();
      if (isDrawing) {
        drawLine(context, x, y, e.clientX, e.clientY);
        setDrawing(false);
      } else if (isClearing) {
        clearLine(context, x, y, e.clientX, e.clientY);
        setClearing(false);
      }
      setX(0);
      setY(0);
    }

    const onMouseLeave = (e: MouseEvent<HTMLCanvasElement>) => {
        const context = getContext();
        if (isDrawing) {
            drawLine(context, x, y, e.clientX, e.clientY);
            setDrawing(false);
        }
        setX(0);
        setY(0);
    }

    const beforeDraw = () => {
        const canvas: any = canvasRef.current;
        const context = getContext();
        // やり直し用スタックの中身を削除
        redoDataStack = [];
        // 元に戻す用の配列が最大保持数より大きくなっているかどうか
        if (undoDataStack.length >= STACK_MAX_SIZE) {
            // 条件に該当する場合末尾の要素を削除
            undoDataStack.pop();
        }
        // 元に戻す配列の先頭にcontextのImageDataを保持する
        undoDataStack.unshift(context.getImageData(0, 0, canvas.width, canvas.height) as never);
    }

    const drawLine = (context: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number) => {
      context.beginPath();
      context.strokeStyle = 'black';
      context.lineWidth = 1;
      context.moveTo(x1, y1);
      context.lineTo(x2, y2);
      context.stroke();
      context.closePath();
    }

    // 参考: https://qiita.com/ampersand/items/69c8d632ed9f60358418
    const redo = () => {
        canvas = document.getElementById('canvas') as HTMLCanvasElement;
        // やり直し用配列にスタックしているデータがなければ処理を終了する
        if (redoDataStack.length <= 0 || !canvas || !context) return;
        // 元に戻す用の配列にやり直し操作をする前のCanvasの状態をスタックしておく
        undoDataStack.unshift(context.getImageData(0, 0, canvas.width, canvas.height) as never);
        // やり直す配列の先頭からイメージデータを取得して
        const imageData: ImageData = redoDataStack.shift()!!;
        // 描画する
        context.putImageData(imageData, 0, 0);
    }

    const undo = () => {
        // 戻す配列にスタックしているデータがなければ処理を終了する
        if (undoDataStack.length <= 0 || !canvas || !context) return;
        // やり直し用の配列に元に戻す操作をする前のCanvasの状態をスタックしておく
        redoDataStack.unshift(context.getImageData(0, 0, canvas.width, canvas.height) as never);
        // 元に戻す配列の先頭からイメージデータを取得して
        var imageData: ImageData = undoDataStack.shift()!!;
        // 描画する
        context.putImageData(imageData, 0, 0);
    }

    const onClearClick = () => {
        setClearEnabled(!isClearEnabled);
    }

    const clearLine = (context: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number) => {
        context.clearRect(x1, y1, 10, 10)
    }
    
    return (
        <>
            <canvas id="canvas"
                ref={canvasRef}
                width="200"
                height="400"
                onMouseDown={onMouseDown}
                onMouseMove={onMouseMove}
                onMouseUp={onMouseUp}
                onMouseLeave={onMouseLeave}
                >canvas</canvas>
            {/* <NormalButton title="clear" onClick={this.onClearClick}/> */}
                <button onClick={onClearClick}>clear</button>
                <button onClick={redo}>redo</button>
                <button onClick={undo}>undo</button>
                <select>テスト</select>
            </>
        )
};

const CanvasBoard = styled.canvas`
    border: 0.5rem outset pink;
`;

const h1 = styled.h1`
    color: red;
`;
