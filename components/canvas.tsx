import React from "react";
import styled from 'styled-components';


export default class Canvas extends React.Component {
    private isDrawing = false;
    private x = 0;
    private y = 0;
    private canvas!: HTMLCanvasElement;

    componentDidMount() {
        this.canvas = document.getElementById('canvas') as HTMLCanvasElement;
        const context = this.canvas.getContext('2d')
        this.canvas.addEventListener('mousedown', e => {
            this.x = e.offsetX
            this.y = e.offsetY
            this.isDrawing = true;
        });
        
        this.canvas.addEventListener('mousemove', e => {
            if (this.isDrawing === true) {
                this.drawLine(context!, this.x, this.y, e.offsetX, e.offsetY);
                this.x = e.offsetX;
                this.y = e.offsetY;
            }
        });

        this.canvas.addEventListener('mouseup', e => {
            if (this.isDrawing === true) {
                this.drawLine(context!, this.x, this.y, e.offsetX, e.offsetY);
                this.x = 0;
                this.y = 0;
                this.isDrawing = false;
            }
        });
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

    startDraw() {
        const canvas = document.getElementById('canvas') as HTMLCanvasElement;
        const ctx = canvas.getContext('2d');

        ctx?.moveTo(0, 0);


        ctx?.strokeRect(10, 10, 50, 50);
    }

    render() {
        return (
            <>
                <canvas id="canvas"
                    className="canvas"
                    width="200"
                    height="400"
                ></canvas>
                <h1>hoge</h1>
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