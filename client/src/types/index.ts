interface Pin {
    id: string;
    name: string;
    type: string;
}

interface Component {
    id: string;
    name: string;
    type: string;
    pins: Pin[];
    x?: number;
    y?: number;
}

interface Connection {
    componentId: string;
    pinId: string;
}

interface Net {
    id: string;
    name: string;
    connections: Connection[];
}

interface ValidationResult {
    rule: string;
    status: "pass" | "fail";
    message: string;
    componentIds?: string[];
    netIds?: string[];
}

export default interface Netlist {
    _id: string;
    name: string;
    description?: string;
    components: Component[];
    nets: Net[];
    validationResults: ValidationResult[];
    createdAt: string;
    updatedAt: string;
}