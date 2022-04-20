export class SortStateHelper {
	public active: string;
	public direction: string;

	public fromString(value: string): void {
		const newValue = value ? value.split(',') : [];

		this.active = newValue[0];
		this.direction = newValue[1] === 'asc' ? 'asc' : 'desc';
	}

	public toString(): string | null {
		if (!this.active || !this.direction) {
			return '';
		}
		return `${this.active},${this.direction}`
	}

	public update(active: string): void {
		if (active === this.active) {
			this.nextDirection();
		} else {
			this.active = active;
			this.direction = 'asc';
		}
	}

	public nextDirection(): void {
		// if (this.direction === 'asc') {
		// 	this.direction = 'desc';
		// } else if (this.direction === 'desc') {
		// 	this.direction = null;
		// 	this.active = null;
		// } else {
		// 	this.direction = 'asc';
		// }

		if (this.direction === 'asc') {
			this.direction = 'desc';
		} else {
			this.direction = 'asc';
		}
	}
}