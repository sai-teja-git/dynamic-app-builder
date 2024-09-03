import { generateRandom } from "../../services/helper-functions.service";

export const chartService = {
    monthChartData() {
        return new Promise(resolve => {
            const axis = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', "Aug", "Sep", "Oct", "Nov", "Dec"];
            let data = [];
            for (let category of axis) {
                data.push({
                    category,
                    value: generateRandom(50, 500)
                })
            }
            setTimeout(() => {
                resolve(data)
            }, generateRandom(500, 2000))
        })
    }
}