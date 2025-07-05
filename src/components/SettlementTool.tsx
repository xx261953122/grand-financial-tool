import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function FinancialSettlementTool() {
  const [income, setIncome] = useState(0);
  const [leads, setLeads] = useState(0);
  const [editingCost, setEditingCost] = useState(0);
  const [actorCost, setActorCost] = useState(0);
  const [otherFlowCost, setOtherFlowCost] = useState(0);
  const [sales, setSales] = useState({ nian: 0, zhuo: 0, x: 0 });
  const [deliveries, setDeliveries] = useState({ a: 0, b: 0, c: 0 });
  const [result, setResult] = useState(null);

  const FIXED_COST = 51960;
  const COMMISSION_TIERS = [
    { max: 20000, rate: 0.05 },
    { max: 50000, rate: 0.1 },
    { max: 100000, rate: 0.15 },
    { max: Infinity, rate: 0.15 },
  ];

  function calculateCommission(amount) {
    let commission = 0;
    let remaining = amount;
    let lastMax = 0;
    for (const tier of COMMISSION_TIERS) {
      const span = Math.min(remaining, tier.max - lastMax);
      commission += span * tier.rate;
      remaining -= span;
      lastMax = tier.max;
      if (remaining <= 0) break;
    }
    return commission;
  }

  function calculate() {
    const leadCost = leads * 5;
    const deliveryTotal =
      (deliveries.a + deliveries.b + deliveries.c) * 350;
    const commissionNian = calculateCommission(sales.nian);
    const commissionZhuo = calculateCommission(sales.zhuo);
    const commissionX = calculateCommission(sales.x);

    const variableCost =
      leadCost + editingCost + actorCost + otherFlowCost +
      commissionNian + commissionZhuo + commissionX + deliveryTotal;
    const totalCost = FIXED_COST + variableCost;
    const profit = income - totalCost;

    setResult({
      leadCost,
      deliveryTotal,
      commissionNian,
      commissionZhuo,
      commissionX,
      totalCost,
      profit,
    });
  }

  return (
    <div className="p-4 grid gap-4 max-w-2xl mx-auto">
      <h1 className="text-xl font-bold">结算工具（网页版）</h1>
      <Input type="number" placeholder="本月收入" onChange={e => setIncome(Number(e.target.value))} />
      <Input type="number" placeholder="加粉人数（客资）" onChange={e => setLeads(Number(e.target.value))} />
      <Input type="number" placeholder="剪辑费用总额" onChange={e => setEditingCost(Number(e.target.value))} />
      <Input type="number" placeholder="演员费用总额" onChange={e => setActorCost(Number(e.target.value))} />
      <Input type="number" placeholder="其他流量支出（非信息流）" onChange={e => setOtherFlowCost(Number(e.target.value))} />

      <h2 className="font-semibold">销售额</h2>
      <Input type="number" placeholder="年老师销售额" onChange={e => setSales({ ...sales, nian: Number(e.target.value) })} />
      <Input type="number" placeholder="卓老师销售额" onChange={e => setSales({ ...sales, zhuo: Number(e.target.value) })} />
      <Input type="number" placeholder="X老师销售额" onChange={e => setSales({ ...sales, x: Number(e.target.value) })} />

      <h2 className="font-semibold">后端交付</h2>
      <Input type="number" placeholder="老师A交付数量" onChange={e => setDeliveries({ ...deliveries, a: Number(e.target.value) })} />
      <Input type="number" placeholder="老师B交付数量" onChange={e => setDeliveries({ ...deliveries, b: Number(e.target.value) })} />
      <Input type="number" placeholder="老师C交付数量" onChange={e => setDeliveries({ ...deliveries, c: Number(e.target.value) })} />

      <Button onClick={calculate}>计算结算结果</Button>

      {result && (
        <Card>
          <CardContent className="p-4">
            <p>客资费用：¥{result.leadCost}</p>
            <p>后端交付总计：¥{result.deliveryTotal}</p>
            <p>年老师提成：¥{result.commissionNian}</p>
            <p>卓老师提成：¥{result.commissionZhuo}</p>
            <p>X老师提成：¥{result.commissionX}</p>
            <hr className="my-2" />
            <p><strong>总支出：</strong>¥{result.totalCost}</p>
            <p><strong>利润：</strong>¥{result.profit}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
