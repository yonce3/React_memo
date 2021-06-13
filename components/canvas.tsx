import React, { useEffect, useState } from "react";
import styled from 'styled-components';
import NormalButton from "./button";

export default function Canvas() {

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
    let context: HTML | null = null;
    // private isDrawing = false;
    // private isClearEnabled = false;
    // private isClearing = false;
    // private x = 0;
    // private y = 0;
    //private canvas!: HTMLCanvasElement;

    // []を第二引数にすることで、初回のみの実行になる
    useEffect(() => {
        canvas = document.getElementById('canvas') as HTMLCanvasElement;
        context = canvas.getContext('2d') as HTML
    }, []);

    // componentDidMount() {
    //     this.canvas = document.getElementById('canvas') as HTMLCanvasElement;
        

        // TODO: AddEventListenerではなく、stateなどを利用
        // https://ja.reactjs.org/docs/handling-events.html
        // this.canvas.addEventListener('mousedown', e => {
        //     if (!this.isClearEnabled) {
        //         this.beforeDraw(context);
        //         this.isDrawing = true;
        //     } else {
        //         this.isClearing = true;
        //     }
        //     setX(e.offsetX)
        //     this.y = e.offsetY
        // });
        
        // this.canvas.addEventListener('mousemove', e => {
        //     if (this.isDrawing) {
        //         this.drawLine(context!, this.x, this.y, e.offsetX, e.offsetY);
        //     } else if (this.isClearing) {
        //         this.clearLine(context!, this.x, this.y, e.offsetX, e.offsetY);
        //     }
        //     this.x = e.offsetX;
        //     this.y = e.offsetY;
        // });

        // this.canvas.addEventListener('mouseup', e => {
        //     if (this.isDrawing === true) {
        //         this.drawLine(context!, this.x, this.y, e.offsetX, e.offsetY);
        //         this.isDrawing = false;
        //     } else if (this.isClearing) {
        //         this.clearLine(context!, this.x, this.y, e.offsetX, e.offsetY);
        //         this.isClearing = false;
        //     }
        //     this.x = 0;
        //     this.y = 0;
        // });

        // this.canvas.addEventListener('mouseleave', e => {
        //     if (this.isDrawing === true) {
        //         this.drawLine(context!, this.x, this.y, e.offsetX, e.offsetY);
        //         this.isDrawing = false;
        //     }
        //     this.x = 0;
        //     this.y = 0;
        // })

        // document.getElementById("clear")?.addEventListener('click', e => {
        //     this.onClearClick();
        // })

        // document.getElementById("redo")?.addEventListener('click', e => {
        //     this.redo(context);
        // })

        // document.getElementById("undo")?.addEventListener('click', e => {
        //     this.undo(context);
        // })
    //}

    function MouseMove(e: MouseEvent) {
        if (isDrawing) {
            drawLine(context!, x, y, e.offsetX, e.offsetY);
        } else if (isClearing) {
            clearLine(context!, x, y, e.offsetX, e.offsetY);
        }
        setX(e.offsetX);
        setY(e.offsetY);
    }
 
    const onMouseDown = (e: MouseEvent) => {
        if (!isClearEnabled) {
            beforeDraw();
            setDrawing(true);
        } else {
            setClearing(true);
        }
        setX(e.offsetX);
        setY(e.offsetY);
    };

    const MouseUp = (e: MouseEvent) => {
      if (isDrawing) {
        drawLine(context!, x, y, e.offsetX, e.offsetY);
        setDrawing(false);
      } else if (isClearing) {
        clearLine(context!, x, y, e.offsetX, e.offsetY);
        setClearing(false);
      }
      setX(0);
      setY(0);
    }

    const MouseLeave = (e: MouseEvent) => {
        if (isDrawing) {
            drawLine(context!, x, y, e.offsetX, e.offsetY);
            setDrawing(false);
        }
        setX(0);
        setY(0);
    }

    const beforeDraw = () => {
        // やり直し用スタックの中身を削除
        redoDataStack = [];
        // 元に戻す用の配列が最大保持数より大きくなっているかどうか
        if (undoDataStack.length >= STACK_MAX_SIZE) {
            // 条件に該当する場合末尾の要素を削除
            undoDataStack.pop();
        }
        // 元に戻す配列の先頭にcontextのImageDataを保持する
        undoDataStack.unshift(context.getImageData(0, 0, canvas!.width, canvas!.height) as never);
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

    // const beforeDraw = (context: CanvasRenderingContext2D) => {
    //     canvas = document.getElementById('canvas') as HTMLCanvasElement;
    //     // やり直し用スタックの中身を削除
    //     this.redoDataStack = [];
    //     // 元に戻す用の配列が最大保持数より大きくなっているかどうか
    //     if (this.undoDataStack.length >= this.STACK_MAX_SIZE) {
    //         // 条件に該当する場合末尾の要素を削除
    //         this.undoDataStack.pop();
    //     }
    //     // 元に戻す配列の先頭にcontextのImageDataを保持する
    //     this.undoDataStack.unshift(context.getImageData(0, 0, this.canvas.width, this.canvas.height) as never);
    // }

    // 参考: https://qiita.com/ampersand/items/69c8d632ed9f60358418
    const redo = () => {
        canvas = document.getElementById('canvas') as HTMLCanvasElement;
        // やり直し用配列にスタックしているデータがなければ処理を終了する
        if (redoDataStack.length <= 0 || !canvas) return;
        // 元に戻す用の配列にやり直し操作をする前のCanvasの状態をスタックしておく
        undoDataStack.unshift(context.getImageData(0, 0, canvas.width, canvas.height) as never);
        // やり直す配列の先頭からイメージデータを取得して
        const imageData: ImageData = redoDataStack.shift()!!;
        // 描画する
        context.putImageData(imageData, 0, 0);
    }

    const undo = () => {
        // 戻す配列にスタックしているデータがなければ処理を終了する
        if (undoDataStack.length <= 0 || !canvas) return;
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
                className="canvas"
                width="200"
                height="400"
                onMouseMove={MouseMove}
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
