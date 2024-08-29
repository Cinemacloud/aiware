// nnqc-quantum.d.ts

// Define a Complex number class
class Complex {
  real: number;
  imaginary: number;

  constructor(real: number, imaginary: number) {
    this.real = real;
    this.imaginary = imaginary;
  }

  add(other: Complex): Complex {
    return new Complex(this.real + other.real, this.imaginary + other.imaginary);
  }

  multiply(other: Complex): Complex {
    return new Complex(
      this.real * other.real - this.imaginary * other.imaginary,
      this.real * other.imaginary + this.imaginary * other.real
    );
  }

  // ... (other complex number operations as needed)
}

// Define nnQC Qubit representation
class nnQCQubit {
  id: number;
  state: Complex[];

  constructor(id: number) {
    this.id = id;
    this.state = [new Complex(1, 0), new Complex(0, 0)]; // Initialize to |0>
  }
}

// Define common quantum gates
class nnQCHadamardGate implements nnQCGate{
  name: string = "H";
  matrix: Complex[][] = [
    [new Complex(1 / Math.sqrt(2), 0), new Complex(1 / Math.sqrt(2), 0)],
    [new Complex(1 / Math.sqrt(2), 0), new Complex(-1 / Math.sqrt(2), 0)],
  ];

  apply(qubit: nnQCQubit): void {
    const newState: Complex[] = [new Complex(0, 0), new Complex(0, 0)];
    for (let i = 0; i < 2; i++) {
      for (let j = 0; j < 2; j++) {
        newState[i] = newState[i].add(this.matrix[i][j].multiply(qubit.state[j]));
      }
    }
    qubit.state = newState;
  }
}

class nnQCXGate implements nnQCGate{
  name: string = "X";
  matrix: Complex[][] = [
    [new Complex(0, 0), new Complex(1, 0)],
    [new Complex(1, 0), new Complex(0, 0)],
  ];

  apply(qubit: nnQCQubit): void {
    const newState: Complex[] = [new Complex(0, 0), new Complex(0, 0)];
    for (let i = 0; i < 2; i++) {
      for (let j = 0; j < 2; j++) {
        newState[i] = newState[i].add(this.matrix[i][j].multiply(qubit.state[j]));
      }
    }
    qubit.state = newState;
  }
}

class nnQCYGate implements nnQCGate{
  name: string = "Y";
  matrix: Complex[][] = [
    [new Complex(0, 0), new Complex(0, -1)],
    [new Complex(0, 1), new Complex(0, 0)],
  ];

  apply(qubit: nnQCQubit): void {
    const newState: Complex[] = [new Complex(0, 0), new Complex(0, 0)];
    for (let i = 0; i < 2; i++) {
      for (let j = 0; j < 2; j++) {
        newState[i] = newState[i].add(this.matrix[i][j].multiply(qubit.state[j]));
      }
    }
    qubit.state = newState;
  }
}

class nnQCZGate implements nnQCGate{
  name: string = "Z";
  matrix: Complex[][] = [
    [new Complex(1, 0), new Complex(0, 0)],
    [new Complex(0, 0), new Complex(-1, 0)],
  ];

  apply(qubit: nnQCQubit): void {
    const newState: Complex[] = [new Complex(0, 0), new Complex(0, 0)];
    for (let i = 0; i < 2; i++) {
      for (let j = 0; j < 2; j++) {
        newState[i] = newState[i].add(this.matrix[i][j].multiply(qubit.state[j]));
      }
    }
    qubit.state = newState;
  }
}

class nnQCCNOTGate implements nnQCGate{
  name: string = "CNOT";
  matrix: Complex[][] = [
    [new Complex(1, 0), new Complex(0, 0), new Complex(0, 0), new Complex(0, 0)],
    [new Complex(0, 0), new Complex(1, 0), new Complex(0, 0), new Complex(0, 0)],
    [new Complex(0, 0), new Complex(0, 0), new Complex(0, 0), new Complex(1, 0)],
    [new Complex(0, 0), new Complex(0, 0), new Complex(1, 0), new Complex(0, 0)],
  ];


  apply(controlQubit: nnQCQubit, targetQubit: nnQCQubit): void {
    if (controlQubit.state[1].real !==0 || controlQubit.state[1].imaginary !== 0 )
    {
        const temp = targetQubit.state[0]
        targetQubit.state[0] = targetQubit.state[1]
        targetQubit.state[1] = temp
    }
  }
}

// ... (other gate definitions as needed - Toffoli, SWAP, etc.)

// Define nnQC's QuantumCircuit class
class nnQCQuantumCircuit {
  qubits: nnQCQubit[] = [];
  gates: { gate: nnQCGate, qubits: nnQCQubit[] }[] = [];

  addQubit(qubit: nnQCQubit): void {
    this.qubits.push(qubit);
  }

  addGate(gate: nnQCGate, qubits: nnQCQubit[]): void {
    this.gates.push({ gate, qubits });
  }

  // ... (other methods - e.g., measure, visualize)
}

// Define nnQC's QuantumSimulator class
class nnQCQuantumSimulator {
  simulate(circuit: nnQCQuantumCircuit): Complex[] {
    // ... (implementation to simulate the circuit and return the final state vector)
    let currentState: Complex[] = [];
    for (let i = 0; i < Math.pow(2, circuit.qubits.length); ++i)
    {
        currentState.push(new Complex(0,0))
    }
    currentState[0] = new Complex(1,0)


    for (let i = 0; i < circuit.gates.length; ++i)
    {
      const gate = circuit.gates[i].gate
      const qubits = circuit.gates[i].qubits

      if (qubits.length === 1)
      {
        //single qubit gate
        const qubitIndex = circuit.qubits.indexOf(qubits[0])
        // console.log("Qubit Index" + qubitIndex)
        for (let j = 0; j < currentState.length; ++j)
        {
          if ( (j >> qubitIndex) & 1)
          {
            //qubit is 1
            const temp = new Complex(currentState[j].real, currentState[j].imaginary)
            currentState[j] = currentState[j ^ (1 << qubitIndex)].multiply(gate.matrix[1][0])
            currentState[j ^ (1 << qubitIndex)] = temp.multiply(gate.matrix[0][0])
            currentState[j] = currentState[j].add(temp.multiply(gate.matrix[0][1]))
            currentState[j ^ (1 << qubitIndex)] = currentState[j ^ (1 << qubitIndex)].add(currentState[j].multiply(gate.matrix[1][1]))
          }
        }
      }
      else if (qubits.length === 2)
      {
        //2 qubit gate - only cnot for now
        const controlIndex = circuit.qubits.indexOf(qubits[0])
        const targetIndex = circuit.qubits.indexOf(qubits[1])

        for (let j = 0; j < currentState.length; ++j)
        {
          if ( ((j >> controlIndex) & 1) && ((j >> targetIndex) & 1))
          {
            //control and target are both 1
            //swap states
            const temp = new Complex(currentState[j].real, currentState[j].imaginary)
            currentState[j] = currentState[j ^ (1 << targetIndex)]
            currentState[j ^ (1 << targetIndex)] = temp
          }
        }
      }

    }
    return currentState
  }
}

// Define a base interface for all gates
interface nnQCGate {
  name: string;
  matrix: Complex[][];
  apply: (qubit: nnQCQubit) => void; // Or (controlQubit: nnQCQubit, targetQubit: nnQCQubit) => void for multi-qubit gates
}

// Export the defined classes and interfaces
export {
  Complex,
  nnQCQubit,
  nnQCHadamardGate,
  nnQCXGate,
  nnQCYGate,
  nnQCZGate,
  nnQCCNOTGate,
  nnQCQuantumCircuit,
  nnQCQuantumSimulator,
  nnQCGate,
};

// Usage
import { nnQCQubit, nnQCHadamardGate, nnQCXGate, nnQCCNOTGate, nnQCQuantumCircuit, nnQCQuantumSimulator } from "./nnqc-quantum";

const qubit1 = new nnQCQubit(0);
const qubit2 = new nnQCQubit(1);

const circuit = new nnQCQuantumCircuit();
circuit.addQubit(qubit1);
circuit.addQubit(qubit2);

const hGate = new nnQCHadamardGate();
circuit.addGate(hGate, [qubit1]);

const cnotGate = new nnQCCNOTGate();
circuit.addGate(cnotGate, [qubit1, qubit2]);

const xGate = new nnQCXGate()
circuit.addGate(xGate, [qubit1])

const simulator = new nnQCQuantumSimulator();
const finalState = simulator.simulate(circuit);

console.log("Final state vector:", finalState);
