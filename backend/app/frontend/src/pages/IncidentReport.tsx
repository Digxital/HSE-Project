import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Camera, Loader2 } from 'lucide-react';
import { client } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface LocationItem {
  id: number;
  name: string;
  type: string;
}

export default function IncidentReport() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [locations, setLocations] = useState<LocationItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    location_id: '',
    incident_type: '',
    severity: '',
    description: '',
    immediate_action: '',
  });

  const incidentTypes = ['First Aid', 'MTI', 'LTI', 'Environmental', 'Property Damage'];
  const severities = ['Low', 'Medium', 'High', 'Critical'];

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const response = await client.entities.locations.query({ query: {}, limit: 50 });
      setLocations(response.data.items || []);
    } catch (error) {
      const err = error as { data?: { detail?: string }; response?: { data?: { detail?: string } }; message?: string };
      const detail = err?.data?.detail || err?.response?.data?.detail || err.message;
      toast({
        title: 'Error',
        description: detail || 'Failed to load locations',
        variant: 'destructive',
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.location_id || !formData.incident_type || !formData.severity || !formData.description || !formData.immediate_action) {
      toast({
        title: 'Missing Fields',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await client.entities.incidents.create({
        data: {
          organization_id: 1,
          location_id: parseInt(formData.location_id),
          incident_type: formData.incident_type,
          severity: formData.severity,
          description: formData.description,
          immediate_action: formData.immediate_action,
          status: 'Reported',
          created_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
        },
      });

      toast({
        title: 'Incident Reported',
        description: 'Your incident report has been submitted successfully',
      });

      navigate('/');
    } catch (error) {
      const err = error as { data?: { detail?: string }; response?: { data?: { detail?: string } }; message?: string };
      const detail = err?.data?.detail || err?.response?.data?.detail || err.message;
      toast({
        title: 'Submission Failed',
        description: detail || 'Failed to submit incident report',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <FileText className="w-6 h-6 text-red-500" />
              Report Incident
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Location */}
              <div>
                <Label htmlFor="location" className="text-slate-300">
                  Location *
                </Label>
                <Select value={formData.location_id} onValueChange={(value) => setFormData({ ...formData, location_id: value })}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    {locations.map((loc) => (
                      <SelectItem key={loc.id} value={loc.id.toString()} className="text-white hover:bg-slate-600">
                        {loc.name} ({loc.type})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Incident Type */}
              <div>
                <Label htmlFor="incident_type" className="text-slate-300">
                  Incident Type *
                </Label>
                <Select value={formData.incident_type} onValueChange={(value) => setFormData({ ...formData, incident_type: value })}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue placeholder="Select incident type" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    {incidentTypes.map((type) => (
                      <SelectItem key={type} value={type} className="text-white hover:bg-slate-600">
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Severity */}
              <div>
                <Label htmlFor="severity" className="text-slate-300">
                  Severity *
                </Label>
                <Select value={formData.severity} onValueChange={(value) => setFormData({ ...formData, severity: value })}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue placeholder="Select severity" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    {severities.map((sev) => (
                      <SelectItem key={sev} value={sev} className="text-white hover:bg-slate-600">
                        {sev}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description" className="text-slate-300">
                  Incident Description *
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe what happened..."
                  className="bg-slate-700 border-slate-600 text-white min-h-[120px]"
                />
              </div>

              {/* Immediate Action */}
              <div>
                <Label htmlFor="immediate_action" className="text-slate-300">
                  Immediate Action Taken *
                </Label>
                <Textarea
                  id="immediate_action"
                  value={formData.immediate_action}
                  onChange={(e) => setFormData({ ...formData, immediate_action: e.target.value })}
                  placeholder="What actions were taken immediately?"
                  className="bg-slate-700 border-slate-600 text-white min-h-[100px]"
                />
              </div>

              {/* Photo Upload */}
              <Button type="button" variant="outline" className="w-full border-slate-600 text-slate-400">
                <Camera className="w-4 h-4 mr-2" />
                Add Evidence Photos
              </Button>

              {/* Submit Button */}
              <Button type="submit" disabled={isSubmitting} className="w-full bg-red-500 hover:bg-red-600 text-white">
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Incident Report'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}