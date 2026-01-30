import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Camera, Mic, MapPin, Sparkles, Loader2 } from 'lucide-react';
import { client } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface LocationItem {
  id: number;
  name: string;
  type: string;
}

interface AISuggestion {
  suggested_category: string;
  suggested_severity: string;
  confidence: string;
}

export default function HazardReport() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [locations, setLocations] = useState<LocationItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAISuggesting, setIsAISuggesting] = useState(false);

  const [formData, setFormData] = useState({
    location_id: '',
    category: '',
    severity: '',
    description: '',
    gps_coordinates: '',
    is_anonymous: false,
  });

  const [aiSuggestion, setAiSuggestion] = useState<AISuggestion | null>(null);

  const categories = ['Unsafe Act', 'Unsafe Condition', 'Near Miss', 'Environmental Hazard', 'Stop Work Authority'];
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

  const handleAISuggest = async () => {
    if (!formData.description.trim()) {
      toast({
        title: 'Description Required',
        description: 'Please enter a hazard description first',
        variant: 'destructive',
      });
      return;
    }

    setIsAISuggesting(true);
    try {
      const response = await client.apiCall.invoke({
        url: '/api/v1/ai/suggest-category',
        method: 'POST',
        data: {
          description: formData.description,
          category_options: categories,
          severity_options: severities,
        },
      });

      setAiSuggestion(response.data);
      setFormData({
        ...formData,
        category: response.data.suggested_category,
        severity: response.data.suggested_severity,
      });

      toast({
        title: 'AI Suggestion Applied',
        description: `Category: ${response.data.suggested_category}, Severity: ${response.data.suggested_severity}`,
      });
    } catch (error) {
      const err = error as { data?: { detail?: string }; response?: { data?: { detail?: string } }; message?: string };
      const detail = err?.data?.detail || err?.response?.data?.detail || err.message;
      toast({
        title: 'AI Suggestion Failed',
        description: detail || 'Could not generate AI suggestion',
        variant: 'destructive',
      });
    } finally {
      setIsAISuggesting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.location_id || !formData.category || !formData.severity || !formData.description) {
      toast({
        title: 'Missing Fields',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await client.entities.hazards.create({
        data: {
          organization_id: 1,
          location_id: parseInt(formData.location_id),
          category: formData.category,
          severity: formData.severity,
          description: formData.description,
          status: 'Open',
          gps_coordinates: formData.gps_coordinates || '',
          is_anonymous: formData.is_anonymous,
          ai_suggested_category: aiSuggestion?.suggested_category || '',
          ai_suggested_severity: aiSuggestion?.suggested_severity || '',
          created_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
        },
      });

      toast({
        title: 'Hazard Reported',
        description: 'Your hazard report has been submitted successfully',
      });

      navigate('/');
    } catch (error) {
      const err = error as { data?: { detail?: string }; response?: { data?: { detail?: string } }; message?: string };
      const detail = err?.data?.detail || err?.response?.data?.detail || err.message;
      toast({
        title: 'Submission Failed',
        description: detail || 'Failed to submit hazard report',
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
              <AlertTriangle className="w-6 h-6 text-orange-500" />
              Report Hazard
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

              {/* Description */}
              <div>
                <Label htmlFor="description" className="text-slate-300">
                  Hazard Description *
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the hazard in detail..."
                  className="bg-slate-700 border-slate-600 text-white min-h-[120px]"
                />
              </div>

              {/* AI Suggestion Button */}
              <Button type="button" onClick={handleAISuggest} disabled={isAISuggesting} variant="outline" className="w-full border-purple-500 text-purple-400 hover:bg-purple-500/10">
                {isAISuggesting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Get AI Suggestion
                  </>
                )}
              </Button>

              {aiSuggestion && (
                <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                  <p className="text-sm text-purple-300 mb-2">AI Suggestion Applied:</p>
                  <div className="flex gap-2">
                    <Badge className="bg-purple-500 text-white">{aiSuggestion.suggested_category}</Badge>
                    <Badge className="bg-purple-500 text-white">{aiSuggestion.suggested_severity}</Badge>
                    <Badge variant="outline" className="border-purple-500 text-purple-300">
                      {aiSuggestion.confidence} confidence
                    </Badge>
                  </div>
                </div>
              )}

              {/* Category */}
              <div>
                <Label htmlFor="category" className="text-slate-300">
                  Category *
                </Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat} className="text-white hover:bg-slate-600">
                        {cat}
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

              {/* GPS Coordinates */}
              <div>
                <Label htmlFor="gps" className="text-slate-300">
                  GPS Coordinates (Optional)
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="gps"
                    value={formData.gps_coordinates}
                    onChange={(e) => setFormData({ ...formData, gps_coordinates: e.target.value })}
                    placeholder="e.g., 29.7604,-95.3698"
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                  <Button type="button" variant="outline" size="icon" className="border-slate-600 text-slate-400">
                    <MapPin className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Photo Upload Simulation */}
              <div className="grid grid-cols-2 gap-2">
                <Button type="button" variant="outline" className="border-slate-600 text-slate-400">
                  <Camera className="w-4 h-4 mr-2" />
                  Add Photo
                </Button>
                <Button type="button" variant="outline" className="border-slate-600 text-slate-400">
                  <Mic className="w-4 h-4 mr-2" />
                  Voice Note
                </Button>
              </div>

              {/* Submit Button */}
              <Button type="submit" disabled={isSubmitting} className="w-full bg-red-500 hover:bg-red-600 text-white">
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Hazard Report'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}