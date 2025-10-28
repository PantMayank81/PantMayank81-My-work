
import React, { useState } from 'react';
import Header from './Header';
import GoalsList from './GoalsList';
import Button from '../shared/Button';
import EditFinancialsModal from './EditFinancialsModal';
import FinancialWellnessScore from './FinancialWellnessScore';
import ProjectionsChart from './ProjectionsChart';
import InsightsCard from './InsightsCard';
import { useData } from '../../context/DataContext';
import Spinner from '../shared/Spinner';


const Dashboard: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { loading } = useData();

    return (
        <div className="bg-gray-100 dark:bg-gray-900 min-h-screen">
            <Header />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {loading ? (
                     <div className="flex justify-center items-center h-96">
                        <Spinner size="lg" />
                     </div>
                ) : (
                    <>
                        <div className="flex justify-between items-center mb-8">
                            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Dashboard</h1>
                            <Button onClick={() => setIsModalOpen(true)} icon={<i className="fa-solid fa-pencil"></i>}>
                                Edit Financials
                            </Button>
                        </div>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                            <div className="lg:col-span-2">
                                <ProjectionsChart />
                            </div>
                            <div>
                                <FinancialWellnessScore />
                            </div>
                        </div>

                        <div className="mb-6">
                           <InsightsCard />
                        </div>

                        <GoalsList />

                        {isModalOpen && <EditFinancialsModal onClose={() => setIsModalOpen(false)} />}
                    </>
                )}
            </main>
        </div>
    );
};

export default Dashboard;
