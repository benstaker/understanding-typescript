export function Autobind(_: any, _2: string, descriptor: PropertyDescriptor) {
    const { configurable, enumerable } = descriptor;
    return {
        configurable,
        enumerable,
        get() {
            return descriptor.value.bind(this);
        }
    };
}
