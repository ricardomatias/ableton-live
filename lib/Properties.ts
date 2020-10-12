import { AbletonLive } from './index';

interface ChildrenInitialProps {
	name: string,
	initialProps: string[]
}

export class Properties<GP, CP, TP, SP, OP> {
	constructor(
		protected ableton: AbletonLive,
		protected ns: string,
		protected path: string,
		protected childrenInitialProps?: Partial<{ [T in keyof CP]: (string | ChildrenInitialProps)[] }>,
		protected _id?: number,
	) {}

	get id(): number | undefined {
		return this._id;
	}

	protected transformers: Partial<
		{ [T in keyof CP]: (val: CP[T]) => any }
	> = {};

	async get<T extends keyof GP>(
		prop: T,
	): Promise<T> {
		const result = await this.ableton.get(this.path, prop as string, this._id);

		return result;
	}

	async children<T extends keyof CP>( child: T): Promise<T extends keyof TP ? TP[T] : CP[T]> {
		let initialProps;

		if (this.childrenInitialProps) {
			initialProps = this.childrenInitialProps[child];
		}

		const result = await this.ableton.getChildren(this.path, { child: child as string, initialProps }, this._id);

		const transformer = this.transformers[child];

		if (result !== null && transformer) {
			return transformer(result);
		} else {
			return result;
		}
	}

	async set<T extends keyof SP>(prop: T, value: SP[T]): Promise<null> {
		return this.ableton.set(this.path, prop as string, value, this._id);
	}

	async observe<T extends keyof OP | keyof CP>(
		prop: T,
		listener: (data: T extends keyof OP ? OP[T] : T extends keyof TP ? TP[T] : any) => any,
	): Promise<any> {
		const child = (prop as any) as keyof CP;
		const transformer = this.transformers[child];

		let initialProps;

		const callback = (data) => {
			if (data !== null && transformer) {
				listener(transformer(data));
			} else {
				listener(data);
			}
		};

		if (this.childrenInitialProps) {
			initialProps = this.childrenInitialProps[child];

			return this.ableton.observe(
				this.path,
				prop as string,
				callback,
				{
					initialProps,
					liveObjectId: this._id,
				},
			);
		} else {
			return this.ableton.observe(
				this.path,
				prop as string,
				callback,
				{
					liveObjectId: this._id,
				},
			);
		}
	}

	protected async call(
		method: string,
		parameters?: any[],
		timeout?: number,
	): Promise<any> {
		return this.ableton.call(this.path, { parameters, method }, this._id, timeout);
	}

	protected async callMultiple(
		calls: any[][],
		timeout?: number,
	): Promise<any> {
		return this.ableton.callMultiple(this.path, calls, this._id, timeout);
	}
}


