import { useParams } from 'react-router-dom';
import StudyPod from '../components/StudyPod';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

export default function PodPage() {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen bg-[#020813] text-white pt-32 px-6 pb-48">
      <StudyPod />
    </div>
  );
}
