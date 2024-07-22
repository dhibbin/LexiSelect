export class MutableDOMRect {
	public left : number
	public top : number
	public width : number
	public height : number
  
	constructor(left : number = 0, top : number = 0, width : number = 0, height : number = 0) {
		this.left = left;
		this.top = top;
		this.width = width;
		this.height = height;
	}
  
	get right() : number {
		return this.left + this.width;
	}
  
	set right(value : number) {
		this.width = value - this.left;
	}
  
	get bottom() : number {
		return this.top + this.height;
	}
  
	set bottom(value : number) {
		this.height = value - this.top;
	}
}
  