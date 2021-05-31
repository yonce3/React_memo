import React from "react";
import styled from 'styled-components';


export default class Canvas extends React.Component {
    private isDrawing = false;
    private isClearEnabled = false;
    private isClearing = false;
    private x = 0;
    private y = 0;
    private canvas!: HTMLCanvasElement;

    // スタックしておく最大回数。キャンバスの大きさの都合などに合わせて調整したら良いです。
    STACK_MAX_SIZE = 5;
    // スタックデータ保存用の配列
    undoDataStack: Array<ImageData> = [];
    redoDataStack: Array<ImageData> = [];

    componentDidMount() {
        this.canvas = document.getElementById('canvas') as HTMLCanvasElement;
        const context = this.canvas.getContext('2d') as HTML

        // TODO: AddEventListenerではなく、stateなどを利用
        // https://ja.reactjs.org/docs/handling-events.html
        this.canvas.addEventListener('mousedown', e => {
            if (!this.isClearEnabled) {
                this.beforeDraw(context);
                this.isDrawing = true;
            } else {
                this.isClearing = true;
            }
            this.x = e.offsetX
            this.y = e.offsetY
        });
        
        this.canvas.addEventListener('mousemove', e => {
            if (this.isDrawing) {
                this.drawLine(context!, this.x, this.y, e.offsetX, e.offsetY);
            } else if (this.isClearing) {
                this.clearLine(context!, this.x, this.y, e.offsetX, e.offsetY);
            }
            this.x = e.offsetX;
            this.y = e.offsetY;
        });

        this.canvas.addEventListener('mouseup', e => {
            if (this.isDrawing === true) {
                this.drawLine(context!, this.x, this.y, e.offsetX, e.offsetY);
                this.isDrawing = false;
            } else if (this.isClearing) {
                this.clearLine(context!, this.x, this.y, e.offsetX, e.offsetY);
                this.isClearing = false;
            }
            this.x = 0;
            this.y = 0;
        });

        this.canvas.addEventListener('mouseleave', e => {
            if (this.isDrawing === true) {
                this.drawLine(context!, this.x, this.y, e.offsetX, e.offsetY);
                this.isDrawing = false;
            }
            this.x = 0;
            this.y = 0;
        })

        document.getElementById("clear")?.addEventListener('click', e => {
            this.onClearClick();
        })

        document.getElementById("redo")?.addEventListener('click', e => {
            this.redo(context);
        })

        document.getElementById("undo")?.addEventListener('click', e => {
            this.undo(context);
        })
    }

    drawLine(context: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number) {
      context.beginPath();
      context.strokeStyle = 'black';
      context.lineWidth = 1;
      context.moveTo(x1, y1);
      context.lineTo(x2, y2);
      context.stroke();
      context.closePath();
    }

    beforeDraw(context: CanvasRenderingContext2D) {
        this.canvas = document.getElementById('canvas') as HTMLCanvasElement;
        // やり直し用スタックの中身を削除
        this.redoDataStack = [];
        // 元に戻す用の配列が最大保持数より大きくなっているかどうか
        if (this.undoDataStack.length >= this.STACK_MAX_SIZE) {
            // 条件に該当する場合末尾の要素を削除
            this.undoDataStack.pop();
        }
        // 元に戻す配列の先頭にcontextのImageDataを保持する
        this.undoDataStack.unshift(context.getImageData(0, 0, this.canvas.width, this.canvas.height) as never);
    }

    // どういう風にオブジェクトを持つか?
    // 参考: https://qiita.com/ampersand/items/69c8d632ed9f60358418
    redo(context: CanvasRenderingContext2D) {
        //座標の情報しか持ってなくない？
        this.canvas = document.getElementById('canvas') as HTMLCanvasElement;
        // やり直し用配列にスタックしているデータがなければ処理を終了する
        if (this.redoDataStack.length <= 0) return;
        // 元に戻す用の配列にやり直し操作をする前のCanvasの状態をスタックしておく
        this.undoDataStack.unshift(context.getImageData(0, 0, this.canvas.width, this.canvas.height) as never);
        // やり直す配列の先頭からイメージデータを取得して
        const imageData: ImageData = this.redoDataStack.shift()!!;
        // 描画する
        context.putImageData(imageData, 0, 0);
    }

    undo(context: CanvasRenderingContext2D) {
        // 戻す配列にスタックしているデータがなければ処理を終了する
        if (this.undoDataStack.length <= 0) return;
        // やり直し用の配列に元に戻す操作をする前のCanvasの状態をスタックしておく
        this.redoDataStack.unshift(context.getImageData(0, 0, this.canvas.width, this.canvas.height) as never);
        // 元に戻す配列の先頭からイメージデータを取得して
        var imageData: ImageData = this.undoDataStack.shift()!!;
        // 描画する
        context.putImageData(imageData, 0, 0);
    }

    onClearClick() {
        this.isClearEnabled = (this.isClearEnabled) ? false : true;
    }

    clearLine(context: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number) {
        context.clearRect(x1, y1, 10, 10)
    }

    render() {
        return (
            <>
                <canvas id="canvas"
                    className="canvas"
                    width="200"
                    height="400"
                >hoge</canvas>
                <button id="clear">clear</button>
                <button id="redo">redo</button>
                <button id="undo">undo</button>
                <select>テスト</select>
            </>
        )
    }
};

const canvas = styled.canvas`
    border: 0.5rem outset pink;
`;

const h1 = styled.h1`
    color: red;
`;