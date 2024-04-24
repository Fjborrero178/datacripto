import { Line } from 'react-chartjs-2';
import { useState, useEffect } from 'react';
import axios,{AxiosError} from "axios";
import '@/app/globals.css';
import { BiBitcoin } from "react-icons/bi";
import { FaEthereum } from "react-icons/fa";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';



ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  interaction: {
    mode: 'index',
    intersect: false,
  },
  stacked: false,
  plugins: {
    title: {
      display: true,
      text: 'BTC vs ETH',    
    },
  },legend: {
    labels: {
      fontColor: "white",
      
    },
    align: "end",
    position: "bottom",
  },
  hover: {
    mode: "nearest",
    intersect: true,
  },
  scales: {
    y: {
      type: 'linear',
      display: true,
      position: 'left',
      
    },
    y1: {
      type: 'linear',
      display: true,
      position: 'right',
      grid: {
        drawOnChartArea: false,
      },
    },
  },
};


export function Graficar() {
   
    const [pricesBit, setPricesBit]= useState([])
    const [lastDateBit, setLastDateBit]= useState([])

    const [pricesEthereum, setPricesEthereum]= useState([])
    

    const peticionDbBitcoin = async()=>{
        await axios.get('/api/getvaluesbitcoin')
        .then(response=>{
            const respuesta = response.data
            const pricesAux=[], last_updateAux=[]
            respuesta.map(elements=>{
                pricesAux.push(elements.Prices);
                last_updateAux.push(new Date(elements.Last_date).toLocaleTimeString());
            });
            setPricesBit(pricesAux)
            setLastDateBit(last_updateAux)
        })
    }
    
    useEffect(()=>{
        peticionDbBitcoin();
    },[])

    const peticionDbEthereum = async()=>{
        await axios.get('/api/getvaluesethereum')
        .then(response=>{
            const respuesta = response.data
            const pricesAuxEthereum=[]
            respuesta.map(elements=>{
                pricesAuxEthereum.push(elements.Prices);
                
            });
            
            setPricesEthereum(pricesAuxEthereum)
        })
    }
    
    useEffect(()=>{
        peticionDbEthereum();
    },[])


    const labels = lastDateBit;
    const data = {
    labels,
    datasets: [
      {
        label: 'Bitcoin',
        data: pricesBit,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        yAxisID: 'y',
        
      },
      {
        label: 'Ethereum',
        data: pricesEthereum,
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        yAxisID: 'y1',
      },
    ],
  };

  return (
  <div className="chart">
    
    
    <Line options={options} data={data} className='w-64 h-32' /> 
  
  </div>);
}
export default Graficar;