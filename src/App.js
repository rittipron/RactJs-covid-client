import { useState, useEffect } from "react";
import axios from "axios";

import { DynamicBarChart } from "react-dynamic-charts";
import "react-dynamic-charts/dist/index.css";

function App() {
  const [dataCovide, setDataCovide] = useState([]);
  const [loading, setLoading] = useState(false);

  const titleStyle = {
    textAlign:"center",
    marginBottom: '0px'
  }

  const renderElement = () =>{
    if(loading) return <DynamicBarChart 
    data={dataCovide} 
    barHeight={20}
    labelStyles={{fontSize: '10px'}}
    iterationTitleStyles={{fontSize: '20px'}}
    iterationTimeout={100} />;
 }

  useEffect(() => {
    axios
      .get("http://localhost:3001/covidworld")
      .then((response) => {
        let res = response.data;
        let date = "";
        let i = -1;
        res.map((val) => {
          if (date == val.timeline) {
            dataCovide[i].values.push({
              id: val.id_country,
              label: val.province==null?val.country:val.country +" "+ val.province,
              value: val.amount,
              color: val.color,
            });
            date = val.timeline;
          } else {
            dataCovide.push({
              name: "Date " + val.timeline,
              values: [
                ...dataCovide,
                {
                  id: val.id_country,
                  label: val.province==null?val.country:val.country +" "+ val.province,
                  value: val.amount,
                  color: val.color,
                },
              ],
            });
            date = val.timeline;
            i++;
          }
        });
      })
      .then(() => {
        console.log("Complie")
        setLoading(true)
      });
  }, []);

  return (
    <div>
      <h1 style={titleStyle}>Covid Global Cases</h1>
      {renderElement()}
    </div>
  );
}

export default App;
