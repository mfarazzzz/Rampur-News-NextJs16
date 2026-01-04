import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { 
  useExams, useResults, useInstitutions, useHolidays, 
  useRestaurants, useFashionStores, useShoppingCentres, useFamousPlaces, useEvents,
  useCreateExam, useDeleteExam, useUpdateExam,
  useCreateHoliday, useDeleteHoliday, useUpdateHoliday,
  useCreateRestaurant, useDeleteRestaurant, useUpdateRestaurant,
  useCreateEvent, useDeleteEvent, useUpdateEvent,
  useCreateInstitution, useDeleteInstitution, useUpdateInstitution,
  useCreateFashionStore, useDeleteFashionStore, useUpdateFashionStore,
  useCreateShoppingCentre, useDeleteShoppingCentre, useUpdateShoppingCentre,
  useCreateFamousPlace, useDeleteFamousPlace, useUpdateFamousPlace,
} from '@/hooks/useExtendedCMS';
import { 
  Plus, Trash2, Search, Calendar, GraduationCap, Utensils, 
  Shirt, Store, Landmark, PartyPopper, Moon, Pencil
} from 'lucide-react';
import ContentEditDialog from '@/components/admin/ContentEditDialog';
import ImageUploader from '@/components/admin/ImageUploader';

const ContentManagerPage = () => {
  const [activeTab, setActiveTab] = useState('exams');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Record<string, any> | null>(null);

  // Data hooks
  const { data: examsData, isLoading: loadingExams } = useExams({ limit: 100 });
  const { data: resultsData, isLoading: loadingResults } = useResults({ limit: 100 });
  const { data: institutionsData, isLoading: loadingInstitutions } = useInstitutions({ limit: 100 });
  const { data: holidaysData, isLoading: loadingHolidays } = useHolidays({ limit: 100 });
  const { data: restaurantsData, isLoading: loadingRestaurants } = useRestaurants({ limit: 100 });
  const { data: fashionData, isLoading: loadingFashion } = useFashionStores({ limit: 100 });
  const { data: shoppingData, isLoading: loadingShopping } = useShoppingCentres({ limit: 100 });
  const { data: placesData, isLoading: loadingPlaces } = useFamousPlaces({ limit: 100 });
  const { data: eventsData, isLoading: loadingEvents } = useEvents({ limit: 100 });

  // Create Mutations
  const createExam = useCreateExam();
  const createHoliday = useCreateHoliday();
  const createRestaurant = useCreateRestaurant();
  const createEvent = useCreateEvent();
  const createInstitution = useCreateInstitution();
  const createFashionStore = useCreateFashionStore();
  const createShoppingCentre = useCreateShoppingCentre();
  const createFamousPlace = useCreateFamousPlace();

  // Update Mutations
  const updateExam = useUpdateExam();
  const updateHoliday = useUpdateHoliday();
  const updateRestaurant = useUpdateRestaurant();
  const updateEvent = useUpdateEvent();
  const updateInstitution = useUpdateInstitution();
  const updateFashionStore = useUpdateFashionStore();
  const updateShoppingCentre = useUpdateShoppingCentre();
  const updateFamousPlace = useUpdateFamousPlace();

  // Delete Mutations
  const deleteExam = useDeleteExam();
  const deleteHoliday = useDeleteHoliday();
  const deleteRestaurant = useDeleteRestaurant();
  const deleteEvent = useDeleteEvent();
  const deleteInstitution = useDeleteInstitution();
  const deleteFashionStore = useDeleteFashionStore();
  const deleteShoppingCentre = useDeleteShoppingCentre();
  const deleteFamousPlace = useDeleteFamousPlace();

  const exams = examsData?.data || [];
  const results = resultsData?.data || [];
  const institutions = institutionsData?.data || [];
  const holidays = holidaysData?.data || [];
  const restaurants = restaurantsData?.data || [];
  const fashionStores = fashionData?.data || [];
  const shoppingCentres = shoppingData?.data || [];
  const famousPlaces = placesData?.data || [];
  const events = eventsData?.data || [];

  const handleDelete = async (type: string, id: string) => {
    if (!confirm('क्या आप वाकई इसे हटाना चाहते हैं?')) return;
    
    try {
      switch (type) {
        case 'exams':
          await deleteExam.mutateAsync(id);
          break;
        case 'holidays':
          await deleteHoliday.mutateAsync(id);
          break;
        case 'restaurants':
          await deleteRestaurant.mutateAsync(id);
          break;
        case 'events':
          await deleteEvent.mutateAsync(id);
          break;
        case 'institutions':
          await deleteInstitution.mutateAsync(id);
          break;
        case 'fashion':
          await deleteFashionStore.mutateAsync(id);
          break;
        case 'shopping':
          await deleteShoppingCentre.mutateAsync(id);
          break;
        case 'places':
          await deleteFamousPlace.mutateAsync(id);
          break;
      }
      toast.success('सफलतापूर्वक हटाया गया');
    } catch {
      toast.error('हटाने में त्रुटि');
    }
  };

  const handleEdit = (item: Record<string, any>) => {
    setEditingItem(item);
    setEditDialogOpen(true);
  };

  const handleSaveEdit = async (data: Record<string, any>) => {
    if (!editingItem?.id) return;
    
    try {
      switch (activeTab) {
        case 'exams':
          await updateExam.mutateAsync({ id: editingItem.id, data });
          break;
        case 'holidays':
          await updateHoliday.mutateAsync({ id: editingItem.id, data });
          break;
        case 'restaurants':
          await updateRestaurant.mutateAsync({ id: editingItem.id, data });
          break;
        case 'events':
          await updateEvent.mutateAsync({ id: editingItem.id, data });
          break;
        case 'institutions':
          await updateInstitution.mutateAsync({ id: editingItem.id, data });
          break;
        case 'fashion':
          await updateFashionStore.mutateAsync({ id: editingItem.id, data });
          break;
        case 'shopping':
          await updateShoppingCentre.mutateAsync({ id: editingItem.id, data });
          break;
        case 'places':
          await updateFamousPlace.mutateAsync({ id: editingItem.id, data });
          break;
      }
      setEditDialogOpen(false);
      setEditingItem(null);
    } catch {
      throw new Error('Update failed');
    }
  };

  const tabs = [
    { id: 'exams', label: 'परीक्षाएं', icon: GraduationCap, count: exams.length },
    { id: 'results', label: 'परिणाम', icon: Calendar, count: results.length },
    { id: 'institutions', label: 'संस्थान', icon: GraduationCap, count: institutions.length },
    { id: 'holidays', label: 'छुट्टियाँ', icon: Moon, count: holidays.length },
    { id: 'restaurants', label: 'रेस्तरां', icon: Utensils, count: restaurants.length },
    { id: 'fashion', label: 'फैशन', icon: Shirt, count: fashionStores.length },
    { id: 'shopping', label: 'शॉपिंग', icon: Store, count: shoppingCentres.length },
    { id: 'places', label: 'स्थान', icon: Landmark, count: famousPlaces.length },
    { id: 'events', label: 'कार्यक्रम', icon: PartyPopper, count: events.length },
  ];

  return (
    <>
      <Helmet>
        <title>कंटेंट मैनेजर - CMS</title>
      </Helmet>

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">कंटेंट मैनेजर</h1>
            <p className="text-muted-foreground">सभी मॉड्यूल की सामग्री प्रबंधित करें</p>
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="खोजें..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  नया जोड़ें
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>नई सामग्री जोड़ें</DialogTitle>
                </DialogHeader>
                <AddContentForm 
                  type={activeTab} 
                  onSuccess={() => {
                    setIsAddDialogOpen(false);
                    toast.success('सफलतापूर्वक जोड़ा गया');
                  }}
                  onCreate={{
                    exam: createExam.mutateAsync,
                    holiday: createHoliday.mutateAsync,
                    restaurant: createRestaurant.mutateAsync,
                    event: createEvent.mutateAsync,
                    institution: createInstitution.mutateAsync,
                    fashion: createFashionStore.mutateAsync,
                    shopping: createShoppingCentre.mutateAsync,
                    place: createFamousPlace.mutateAsync,
                  }}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="flex-wrap h-auto gap-1 p-1">
            {tabs.map(tab => (
              <TabsTrigger 
                key={tab.id} 
                value={tab.id}
                className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
                <Badge variant="secondary" className="ml-1">{tab.count}</Badge>
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="exams" className="mt-4">
            <ContentTable 
              data={exams}
              columns={['titleHindi', 'examDate', 'organization', 'status']}
              columnLabels={{ titleHindi: 'शीर्षक', examDate: 'तारीख', organization: 'संस्था', status: 'स्थिति' }}
              onDelete={(id) => handleDelete('exams', id)}
              onEdit={handleEdit}
              isLoading={loadingExams}
            />
          </TabsContent>

          <TabsContent value="results" className="mt-4">
            <ContentTable 
              data={results}
              columns={['titleHindi', 'resultDate', 'organizationHindi']}
              columnLabels={{ titleHindi: 'शीर्षक', resultDate: 'तारीख', organizationHindi: 'संस्था' }}
              onDelete={(id) => handleDelete('results', id)}
              onEdit={handleEdit}
              isLoading={loadingResults}
            />
          </TabsContent>

          <TabsContent value="institutions" className="mt-4">
            <ContentTable 
              data={institutions}
              columns={['nameHindi', 'type', 'city', 'affiliation']}
              columnLabels={{ nameHindi: 'नाम', type: 'प्रकार', city: 'शहर', affiliation: 'संबद्धता' }}
              onDelete={(id) => handleDelete('institutions', id)}
              onEdit={handleEdit}
              isLoading={loadingInstitutions}
            />
          </TabsContent>

          <TabsContent value="holidays" className="mt-4">
            <ContentTable 
              data={holidays}
              columns={['nameHindi', 'date', 'type', 'isPublicHoliday']}
              columnLabels={{ nameHindi: 'नाम', date: 'तारीख', type: 'प्रकार', isPublicHoliday: 'सार्वजनिक' }}
              onDelete={(id) => handleDelete('holidays', id)}
              onEdit={handleEdit}
              isLoading={loadingHolidays}
            />
          </TabsContent>

          <TabsContent value="restaurants" className="mt-4">
            <ContentTable 
              data={restaurants}
              columns={['nameHindi', 'type', 'addressHindi', 'rating']}
              columnLabels={{ nameHindi: 'नाम', type: 'प्रकार', addressHindi: 'पता', rating: 'रेटिंग' }}
              onDelete={(id) => handleDelete('restaurants', id)}
              onEdit={handleEdit}
              isLoading={loadingRestaurants}
            />
          </TabsContent>

          <TabsContent value="fashion" className="mt-4">
            <ContentTable 
              data={fashionStores}
              columns={['nameHindi', 'type', 'category', 'addressHindi']}
              columnLabels={{ nameHindi: 'नाम', type: 'प्रकार', category: 'श्रेणी', addressHindi: 'पता' }}
              onDelete={(id) => handleDelete('fashion', id)}
              onEdit={handleEdit}
              isLoading={loadingFashion}
            />
          </TabsContent>

          <TabsContent value="shopping" className="mt-4">
            <ContentTable 
              data={shoppingCentres}
              columns={['nameHindi', 'type', 'addressHindi', 'storeCount']}
              columnLabels={{ nameHindi: 'नाम', type: 'प्रकार', addressHindi: 'पता', storeCount: 'दुकानें' }}
              onDelete={(id) => handleDelete('shopping', id)}
              onEdit={handleEdit}
              isLoading={loadingShopping}
            />
          </TabsContent>

          <TabsContent value="places" className="mt-4">
            <ContentTable 
              data={famousPlaces}
              columns={['nameHindi', 'type', 'addressHindi', 'rating']}
              columnLabels={{ nameHindi: 'नाम', type: 'प्रकार', addressHindi: 'पता', rating: 'रेटिंग' }}
              onDelete={(id) => handleDelete('places', id)}
              onEdit={handleEdit}
              isLoading={loadingPlaces}
            />
          </TabsContent>

          <TabsContent value="events" className="mt-4">
            <ContentTable 
              data={events}
              columns={['titleHindi', 'date', 'venueHindi', 'status']}
              columnLabels={{ titleHindi: 'शीर्षक', date: 'तारीख', venueHindi: 'स्थान', status: 'स्थिति' }}
              onDelete={(id) => handleDelete('events', id)}
              onEdit={handleEdit}
              isLoading={loadingEvents}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Edit Dialog */}
      <ContentEditDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        type={activeTab}
        data={editingItem}
        onSave={handleSaveEdit}
      />
    </>
  );
};

// Content Table Component
interface ContentTableProps {
  data: any[];
  columns: string[];
  columnLabels: Record<string, string>;
  onDelete: (id: string) => void;
  onEdit: (item: any) => void;
  isLoading: boolean;
}

const ContentTable = ({ data, columns, columnLabels, onDelete, onEdit, isLoading }: ContentTableProps) => {
  if (isLoading) {
    return <div className="text-center py-8 text-muted-foreground">लोड हो रहा है...</div>;
  }

  if (data.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">कोई डेटा नहीं मिला</div>;
  }

  const formatValue = (value: any, key: string) => {
    if (value === undefined || value === null) return '-';
    if (typeof value === 'boolean') return value ? 'हाँ' : 'नहीं';
    if (key.includes('date') || key.includes('Date')) {
      return new Date(value).toLocaleDateString('hi-IN');
    }
    return String(value);
  };

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map(col => (
                <TableHead key={col}>{columnLabels[col]}</TableHead>
              ))}
              <TableHead className="w-28">कार्रवाई</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.id}>
                {columns.map(col => (
                  <TableCell key={col}>{formatValue(item[col], col)}</TableCell>
                ))}
                <TableCell>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-primary hover:text-primary"
                      onClick={() => onEdit(item)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive"
                      onClick={() => onDelete(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

// Add Content Form Component
interface AddContentFormProps {
  type: string;
  onSuccess: () => void;
  onCreate: Record<string, (data: any) => Promise<any>>;
}

const AddContentForm = ({ type, onSuccess, onCreate }: AddContentFormProps) => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const slug = formData.title?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') || 
                   formData.name?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') || 
                   `item-${Date.now()}`;
      
      switch (type) {
        case 'exams':
          await onCreate.exam({ ...formData, slug, status: 'upcoming' });
          break;
        case 'holidays':
          await onCreate.holiday({ ...formData, slug, isRecurring: true });
          break;
        case 'restaurants':
          await onCreate.restaurant({ ...formData, slug, cuisine: formData.cuisine?.split(',') || [] });
          break;
        case 'events':
          await onCreate.event({ ...formData, slug, status: 'upcoming' });
          break;
        case 'institutions':
          await onCreate.institution({ ...formData, slug });
          break;
        case 'fashion':
          await onCreate.fashion({ ...formData, slug, brands: formData.brands?.split(',') || [] });
          break;
        case 'shopping':
          await onCreate.shopping({ ...formData, slug, stores: formData.stores?.split(',') || [] });
          break;
        case 'places':
          await onCreate.place({ ...formData, slug });
          break;
      }
      onSuccess();
    } catch {
      toast.error('जोड़ने में त्रुटि');
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateField = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const renderFormFields = () => {
    switch (type) {
      case 'exams':
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>शीर्षक (हिंदी)</Label>
                <Input onChange={(e) => updateField('titleHindi', e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label>Title (English)</Label>
                <Input onChange={(e) => updateField('title', e.target.value)} required />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>परीक्षा तारीख</Label>
                <Input type="date" onChange={(e) => updateField('examDate', e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label>श्रेणी</Label>
                <Select onValueChange={(v) => updateField('category', v)}>
                  <SelectTrigger><SelectValue placeholder="चुनें" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="board">बोर्ड</SelectItem>
                    <SelectItem value="entrance">प्रवेश</SelectItem>
                    <SelectItem value="government">सरकारी</SelectItem>
                    <SelectItem value="university">विश्वविद्यालय</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>संस्था (हिंदी)</Label>
                <Input onChange={(e) => updateField('organizationHindi', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Organization</Label>
                <Input onChange={(e) => updateField('organization', e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>विवरण</Label>
              <Textarea onChange={(e) => updateField('description', e.target.value)} />
            </div>
            <ImageUploader
              value={formData.image}
              onChange={(v) => updateField('image', v)}
              label="इमेज"
            />
          </>
        );

      case 'holidays':
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>नाम (हिंदी)</Label>
                <Input onChange={(e) => updateField('nameHindi', e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label>Name (English)</Label>
                <Input onChange={(e) => updateField('name', e.target.value)} required />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>तारीख</Label>
                <Input type="date" onChange={(e) => updateField('date', e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label>प्रकार</Label>
                <Select onValueChange={(v) => updateField('type', v)}>
                  <SelectTrigger><SelectValue placeholder="चुनें" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="national">राष्ट्रीय</SelectItem>
                    <SelectItem value="religious">धार्मिक</SelectItem>
                    <SelectItem value="cultural">सांस्कृतिक</SelectItem>
                    <SelectItem value="bank">बैंक</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>विवरण (हिंदी)</Label>
                <Textarea onChange={(e) => updateField('descriptionHindi', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea onChange={(e) => updateField('description', e.target.value)} />
              </div>
            </div>
            <ImageUploader
              value={formData.image}
              onChange={(v) => updateField('image', v)}
              label="इमेज"
            />
          </>
        );

      case 'restaurants':
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>नाम (हिंदी)</Label>
                <Input onChange={(e) => updateField('nameHindi', e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label>Name (English)</Label>
                <Input onChange={(e) => updateField('name', e.target.value)} required />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>प्रकार</Label>
                <Select onValueChange={(v) => updateField('type', v)}>
                  <SelectTrigger><SelectValue placeholder="चुनें" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="restaurant">रेस्तरां</SelectItem>
                    <SelectItem value="dhaba">ढाबा</SelectItem>
                    <SelectItem value="sweet-shop">मिठाई</SelectItem>
                    <SelectItem value="cafe">कैफे</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>बजट</Label>
                <Select onValueChange={(v) => updateField('priceRange', v)}>
                  <SelectTrigger><SelectValue placeholder="चुनें" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="budget">सस्ता</SelectItem>
                    <SelectItem value="moderate">मध्यम</SelectItem>
                    <SelectItem value="expensive">महंगा</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>व्यंजन (कॉमा से अलग)</Label>
              <Input placeholder="North Indian, Mughlai" onChange={(e) => updateField('cuisine', e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>पता (हिंदी)</Label>
                <Input onChange={(e) => updateField('addressHindi', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Address</Label>
                <Input onChange={(e) => updateField('address', e.target.value)} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>फोन</Label>
                <Input onChange={(e) => updateField('phone', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>रेटिंग (1-5)</Label>
                <Input type="number" min="1" max="5" step="0.1" onChange={(e) => updateField('rating', parseFloat(e.target.value))} />
              </div>
            </div>
            <ImageUploader
              value={formData.image}
              onChange={(v) => updateField('image', v)}
              label="मुख्य इमेज"
            />
            <ImageUploader
              value={formData.gallery}
              onChange={(v) => updateField('gallery', v)}
              label="गैलरी"
              multiple
              maxImages={10}
            />
          </>
        );

      case 'fashion':
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>नाम (हिंदी)</Label>
                <Input onChange={(e) => updateField('nameHindi', e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label>Name (English)</Label>
                <Input onChange={(e) => updateField('name', e.target.value)} required />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>प्रकार</Label>
                <Select onValueChange={(v) => updateField('type', v)}>
                  <SelectTrigger><SelectValue placeholder="चुनें" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="boutique">बुटीक</SelectItem>
                    <SelectItem value="showroom">शोरूम</SelectItem>
                    <SelectItem value="tailor">दर्जी</SelectItem>
                    <SelectItem value="brand-store">ब्रांड स्टोर</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>श्रेणी</Label>
                <Select onValueChange={(v) => updateField('category', v)}>
                  <SelectTrigger><SelectValue placeholder="चुनें" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="men">पुरुष</SelectItem>
                    <SelectItem value="women">महिला</SelectItem>
                    <SelectItem value="kids">बच्चे</SelectItem>
                    <SelectItem value="all">सभी</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>ब्रांड्स (कॉमा से अलग)</Label>
              <Input placeholder="Raymond, Peter England" onChange={(e) => updateField('brands', e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>पता (हिंदी)</Label>
                <Input onChange={(e) => updateField('addressHindi', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Address</Label>
                <Input onChange={(e) => updateField('address', e.target.value)} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>फोन</Label>
                <Input onChange={(e) => updateField('phone', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>रेटिंग (1-5)</Label>
                <Input type="number" min="1" max="5" step="0.1" onChange={(e) => updateField('rating', parseFloat(e.target.value))} />
              </div>
            </div>
            <ImageUploader
              value={formData.image}
              onChange={(v) => updateField('image', v)}
              label="मुख्य इमेज"
            />
            <ImageUploader
              value={formData.gallery}
              onChange={(v) => updateField('gallery', v)}
              label="गैलरी"
              multiple
              maxImages={10}
            />
          </>
        );

      case 'shopping':
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>नाम (हिंदी)</Label>
                <Input onChange={(e) => updateField('nameHindi', e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label>Name (English)</Label>
                <Input onChange={(e) => updateField('name', e.target.value)} required />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>प्रकार</Label>
                <Select onValueChange={(v) => updateField('type', v)}>
                  <SelectTrigger><SelectValue placeholder="चुनें" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mall">मॉल</SelectItem>
                    <SelectItem value="market">बाज़ार</SelectItem>
                    <SelectItem value="complex">कॉम्प्लेक्स</SelectItem>
                    <SelectItem value="plaza">प्लाज़ा</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>दुकानों की संख्या</Label>
                <Input type="number" onChange={(e) => updateField('storeCount', parseInt(e.target.value))} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>दुकानें (कॉमा से अलग)</Label>
              <Input placeholder="Big Bazaar, Reliance Fresh" onChange={(e) => updateField('stores', e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>पता (हिंदी)</Label>
                <Input onChange={(e) => updateField('addressHindi', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Address</Label>
                <Input onChange={(e) => updateField('address', e.target.value)} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>फोन</Label>
                <Input onChange={(e) => updateField('phone', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>रेटिंग (1-5)</Label>
                <Input type="number" min="1" max="5" step="0.1" onChange={(e) => updateField('rating', parseFloat(e.target.value))} />
              </div>
            </div>
            <ImageUploader
              value={formData.image}
              onChange={(v) => updateField('image', v)}
              label="मुख्य इमेज"
            />
            <ImageUploader
              value={formData.gallery}
              onChange={(v) => updateField('gallery', v)}
              label="गैलरी"
              multiple
              maxImages={10}
            />
          </>
        );

      case 'places':
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>नाम (हिंदी)</Label>
                <Input onChange={(e) => updateField('nameHindi', e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label>Name (English)</Label>
                <Input onChange={(e) => updateField('name', e.target.value)} required />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>प्रकार</Label>
                <Select onValueChange={(v) => updateField('type', v)}>
                  <SelectTrigger><SelectValue placeholder="चुनें" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="historical">ऐतिहासिक</SelectItem>
                    <SelectItem value="religious">धार्मिक</SelectItem>
                    <SelectItem value="natural">प्राकृतिक</SelectItem>
                    <SelectItem value="recreational">मनोरंजन</SelectItem>
                    <SelectItem value="cultural">सांस्कृतिक</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>प्रवेश शुल्क</Label>
                <Input placeholder="निःशुल्क या ₹50" onChange={(e) => updateField('entryFee', e.target.value)} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>पता (हिंदी)</Label>
                <Input onChange={(e) => updateField('addressHindi', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Address</Label>
                <Input onChange={(e) => updateField('address', e.target.value)} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>समय</Label>
                <Input placeholder="सुबह 6 - शाम 8" onChange={(e) => updateField('timings', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>रेटिंग (1-5)</Label>
                <Input type="number" min="1" max="5" step="0.1" onChange={(e) => updateField('rating', parseFloat(e.target.value))} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>विवरण (हिंदी)</Label>
                <Textarea onChange={(e) => updateField('descriptionHindi', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea onChange={(e) => updateField('description', e.target.value)} />
              </div>
            </div>
            <ImageUploader
              value={formData.image}
              onChange={(v) => updateField('image', v)}
              label="मुख्य इमेज"
            />
            <ImageUploader
              value={formData.gallery}
              onChange={(v) => updateField('gallery', v)}
              label="गैलरी"
              multiple
              maxImages={10}
            />
          </>
        );

      case 'events':
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>शीर्षक (हिंदी)</Label>
                <Input onChange={(e) => updateField('titleHindi', e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label>Title (English)</Label>
                <Input onChange={(e) => updateField('title', e.target.value)} required />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>तारीख</Label>
                <Input type="date" onChange={(e) => updateField('date', e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label>श्रेणी</Label>
                <Select onValueChange={(v) => updateField('category', v)}>
                  <SelectTrigger><SelectValue placeholder="चुनें" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cultural">सांस्कृतिक</SelectItem>
                    <SelectItem value="religious">धार्मिक</SelectItem>
                    <SelectItem value="sports">खेल</SelectItem>
                    <SelectItem value="educational">शैक्षिक</SelectItem>
                    <SelectItem value="entertainment">मनोरंजन</SelectItem>
                    <SelectItem value="food">खाना</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>स्थान (हिंदी)</Label>
                <Input onChange={(e) => updateField('venueHindi', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Venue</Label>
                <Input onChange={(e) => updateField('venue', e.target.value)} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>शहर</Label>
                <Input defaultValue="रामपुर" onChange={(e) => updateField('city', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>पता</Label>
                <Input onChange={(e) => updateField('address', e.target.value)} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>विवरण (हिंदी)</Label>
                <Textarea onChange={(e) => updateField('descriptionHindi', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea onChange={(e) => updateField('description', e.target.value)} />
              </div>
            </div>
            <ImageUploader
              value={formData.image}
              onChange={(v) => updateField('image', v)}
              label="इमेज"
            />
          </>
        );

      case 'institutions':
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>नाम (हिंदी)</Label>
                <Input onChange={(e) => updateField('nameHindi', e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label>Name (English)</Label>
                <Input onChange={(e) => updateField('name', e.target.value)} required />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>प्रकार</Label>
                <Select onValueChange={(v) => updateField('type', v)}>
                  <SelectTrigger><SelectValue placeholder="चुनें" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="school">स्कूल</SelectItem>
                    <SelectItem value="college">कॉलेज</SelectItem>
                    <SelectItem value="university">विश्वविद्यालय</SelectItem>
                    <SelectItem value="coaching">कोचिंग</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>संबद्धता</Label>
                <Input placeholder="CBSE, UP Board, etc." onChange={(e) => updateField('affiliation', e.target.value)} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>पता (हिंदी)</Label>
                <Input onChange={(e) => updateField('addressHindi', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Address</Label>
                <Input onChange={(e) => updateField('address', e.target.value)} />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>शहर</Label>
                <Input defaultValue="रामपुर" onChange={(e) => updateField('city', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>जिला</Label>
                <Input defaultValue="रामपुर" onChange={(e) => updateField('district', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>पिनकोड</Label>
                <Input onChange={(e) => updateField('pincode', e.target.value)} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>विवरण (हिंदी)</Label>
                <Textarea onChange={(e) => updateField('descriptionHindi', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea onChange={(e) => updateField('description', e.target.value)} />
              </div>
            </div>
            <ImageUploader
              value={formData.image}
              onChange={(v) => updateField('image', v)}
              label="इमेज"
            />
            <ImageUploader
              value={formData.gallery}
              onChange={(v) => updateField('gallery', v)}
              label="गैलरी"
              multiple
              maxImages={10}
            />
          </>
        );

      default:
        return <p className="text-muted-foreground">इस प्रकार के लिए फॉर्म उपलब्ध नहीं है</p>;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {renderFormFields()}
      <div className="flex justify-end gap-2 pt-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'जोड़ा जा रहा है...' : 'जोड़ें'}
        </Button>
      </div>
    </form>
  );
};

export default ContentManagerPage;