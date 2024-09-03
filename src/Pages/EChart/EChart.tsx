import ReactEcharts from "echarts-for-react";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { useState } from "react";
import { InputText } from "primereact/inputtext";
import { FloatLabel } from "primereact/floatlabel";
import { InputNumber } from "primereact/inputnumber";

export default function EChart() {

    const [eChartsRef, setEChartInstance] = useState<any>(null);
    const [newOption, setNewOption] = useState<{
        category: string,
        value: number | null
    }>({
        category: "",
        value: null
    })

    const option = {
        xAxis: {
            type: 'category',
            data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']
        },
        yAxis: {
            type: 'value'
        },
        tooltip: {
            formatter: (params: any) => {
                const data = params.data
                return `
                <h3>${params.name}</h3>
                <div>Duration : ${data.displayValue}</div>
                `
            },
        },
        series: [
            {
                data: [
                    {
                        "value": 120,
                        "displayValue": "120 M"
                    },
                    {
                        "value": 200,
                        "displayValue": "200 M"
                    },
                    {
                        "value": 150,
                        "displayValue": "150 M"
                    },
                    {
                        "value": 80,
                        "displayValue": "80 M"
                    },
                    {
                        "value": 70,
                        "displayValue": "70 M"
                    },
                    {
                        "value": 110,
                        "displayValue": "110 M"
                    },
                    {
                        "value": 130,
                        "displayValue": "130 M"
                    }
                ],
                type: 'bar'
            }
        ]
    };

    const addOption = () => {
        if (eChartsRef) {
            const copiedData = JSON.parse(JSON.stringify(newOption))
            const current = eChartsRef.getOption()
            const newCategories = [...current.xAxis[0].data, copiedData.category]
            const newSeriesData = [
                ...current.series[0].data,
                {
                    value: copiedData.value,
                    displayValue: `${copiedData.value} M`
                }
            ]
            eChartsRef.setOption({
                xAxis: {
                    data: newCategories
                },
                series: [
                    {
                        data: newSeriesData
                    }
                ]
            }, {
                lazyUpdate: true
            });
            // setTimeout(() => { clearData() }, 100)
        }
    }

    const clearData = () => {
        setNewOption({
            category: "",
            value: null
        })
    }

    const footer = (
        <>
            <Button label="Clear" severity="secondary" icon="pi pi-times" size="small"
                disabled={!newOption.category && (!newOption.value && newOption.value != 0)} onClick={() => clearData()} />
            <Button label="Post" icon="pi pi-check" style={{ marginLeft: '0.5em' }} size="small" onClick={() => addOption()}
                disabled={!newOption.category || (!newOption.value && newOption.value != 0)} />
        </>
    );

    return (
        <>
            <div>

                <ReactEcharts option={option} onChartReady={(e) => {
                    setEChartInstance(e)
                }} />
            </div>
            <Card title="Add New Point" footer={footer} className="md:w-25rem">
                <FloatLabel>
                    <InputText id="categoryName" value={newOption.category} onChange={(e) => setNewOption(previous => ({
                        ...previous,
                        category: e.target.value
                    }))} />
                    <label htmlFor="categoryName">Category</label>
                </FloatLabel>
                <div className="mt-5">
                    <FloatLabel>
                        <InputNumber id="seriesValue" value={newOption.value} onChange={(e) => setNewOption(previous => ({
                            ...previous,
                            value: e.value as number
                        }))} />
                        <label htmlFor="seriesValue">Value</label>
                    </FloatLabel>
                </div>
            </Card>
            {/* <Button label="Add Point" icon="pi pi-check"  size="small" /> */}
        </>
    )
}
