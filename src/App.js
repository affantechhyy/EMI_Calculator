import { useEffect, useState } from "react";
import "./styles.css";
import { numberWithCommas } from "./utils/config";
import { tenureData } from "./utils/constant";
import TextInput from "./components/text-input";
import SliderInput from "./components/slider-input";

export default function App() {
  const [cost, setCost] = useState(0);
  const [interest, setInterest] = useState(10);
  const [fee, setFee] = useState(1);
  const [downPayment, setdownPayment] = useState(0);
  const [tenure, setTenure] = useState(12);
  const [emi, setEmi] = useState(0);

  const calculateEMI = (downPayment) => {
    // const amount = [P * R * (1 + R) * N] / [(1 + R) * N - 1];
    if (!cost) return;
    const loanAmt = cost - downPayment;
    const rateOfInterest = interest / 100;
    const numOfYears = tenure / 12;
    const EMI =
      (loanAmt * rateOfInterest * (1 + rateOfInterest) ** numOfYears) /
      ((1 + rateOfInterest) ** numOfYears - 1);
    return Number(EMI / 12).toFixed(0);
  };

  const calculateDP = (emi) => {
    if (!cost) return;
    const downPaymentPercent = 100 - (emi / calculateEMI(0)) * 100;
    return Number((downPaymentPercent / 100) * cost).toFixed(0);
  };

  useEffect(() => {
    if (!(cost > 0)) {
      setdownPayment(0);
      setEmi(0);
    }
    const emi = calculateEMI(downPayment);
    setEmi(emi);
  }, [tenure, cost]);

  const updateEmi = (e) => {
    if (!cost) return;
    const dp = Number(e.target.value);
    setdownPayment(dp.toFixed(0));
    const emi = calculateEMI(dp);
    setEmi(emi);
  };
  const updateDownPayment = (e) => {
    if (!cost) return;
    const emi = Number(e.target.value);
    setEmi(emi.toFixed(0));
    const dp = calculateDP(emi);
    setdownPayment(dp);
  };

  const totalDownPayment = () => {
    return numberWithCommas(
      Number(downPayment) + (cost - downPayment) * (fee / 100).toFixed(0)
    );
  };

  const totalLoanPayment = () => {
    return numberWithCommas((emi * tenure).toFixed(0));
  };
  return (
    <div className="App">
      <span className="title" style={{ fontSize: 30, marginTop: 10 }}>
        EMI Calculator
      </span>
      <TextInput
        title={"Total Cost of Assets"}
        state={cost}
        setState={setCost}
      />
      <TextInput
        title={"Interest Rate(in %)"}
        state={interest}
        setState={setInterest}
      />
      <TextInput title={"Processing Fee(in %)"} state={fee} setState={setFee} />
      <SliderInput
        title={"Down Payment"}
        state={downPayment}
        setState={updateEmi}
        underlineTitle={`Total Down Payment -${totalDownPayment()}`}
        min={0}
        max={cost}
        labelMin={"0%"}
        labelMax={"100%"}
      />
      <SliderInput
        title={"Loan per Month"}
        state={emi}
        setState={updateDownPayment}
        underlineTitle={`Total Loan Payment -${totalLoanPayment()}`}
        min={calculateEMI(cost)}
        max={calculateEMI(0)}
      />

      <span className="title">Tenure</span>
      <div className="tenureContainer">
        {tenureData.map((t) => {
          return (
            <button
              className={`tenure ${t == tenure ? "selected" : ""}`}
              onClick={() => setTenure(t)}
            >
              {t}
            </button>
          );
        })}
      </div>
    </div>
  );
}
