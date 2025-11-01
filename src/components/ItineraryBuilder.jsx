'use client';
import { useState, useRef } from 'react';
import { Plus, Trash2, Edit3, Calendar, MapPin, Clock, Plane, Hotel, Utensils, Map } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function ItineraryBuilder({ trip, onItineraryUpdate }) {
  const [itinerary, setItinerary] = useState(trip?.itinerary || []);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  
  const [newItem, setNewItem] = useState({
    type: 'activity',
    title: '',
    description: '',
    date: '',
    startTime: '',
    endTime: '',
    location: '',
    address: '',
    cost: 0,
    notes: '',
    bookingReference: '',
    attachments: []
  });

  const activityTypes = [
    { value: 'flight', label: 'Flight', icon: Plane, color: 'blue' },
    { value: 'accommodation', label: 'Accommodation', icon: Hotel, color: 'green' },
    { value: 'activity', label: 'Activity', icon: Map, color: 'purple' },
    { value: 'dining', label: 'Dining', icon: Utensils, color: 'orange' },
    { value: 'transport', label: 'Transport', icon: '🚗', color: 'gray' },
    { value: 'other', label: 'Other', icon: '📝', color: 'gray' }
  ];

  const getActivityIcon = (type) => {
    const activity = activityTypes.find(a => a.value === type);
    return activity?.icon || Map;
  };

  const getActivityColor = (type) => {
    const activity = activityTypes.find(a => a.value === type);
    return activity?.color || 'gray';
  };

  const handleAddItem = (e) => {
    e.preventDefault();
    
    const itemToAdd = {
      ...newItem,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };

    const updatedItinerary = [...itinerary, itemToAdd];
    setItinerary(updatedItinerary);
    
    if (onItineraryUpdate) {
      onItineraryUpdate(updatedItinerary);
    }
    
    setShowAddDialog(false);
    resetForm();
  };

  const handleUpdateItem = (e) => {
    e.preventDefault();
    
    const updatedItinerary = itinerary.map(item =>
      item.id === editingItem.id ? { ...editingItem } : item
    );
    
    setItinerary(updatedItinerary);
    
    if (onItineraryUpdate) {
      onItineraryUpdate(updatedItinerary);
    }
    
    setEditingItem(null);
    resetForm();
  };

  const handleDeleteItem = (itemId) => {
    if (!confirm('Are you sure you want to remove this item from your itinerary?')) return;
    
    const updatedItinerary = itinerary.filter(item => item.id !== itemId);
    setItinerary(updatedItinerary);
    
    if (onItineraryUpdate) {
      onItineraryUpdate(updatedItinerary);
    }
  };

  const handleDragStart = (e, index) => {
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, newIndex) => {
    e.preventDefault();
    const oldIndex = parseInt(e.dataTransfer.getData('text/plain'));
    
    if (oldIndex === newIndex) return;
    
    const newItinerary = [...itinerary];
    const [movedItem] = newItinerary.splice(oldIndex, 1);
    newItinerary.splice(newIndex, 0, movedItem);
    
    setItinerary(newItinerary);
    
    if (onItineraryUpdate) {
      onItineraryUpdate(newItinerary);
    }
  };

  const resetForm = () => {
    setNewItem({
      type: 'activity',
      title: '',
      description: '',
      date: '',
      startTime: '',
      endTime: '',
      location: '',
      address: '',
      cost: 0,
      notes: '',
      bookingReference: '',
      attachments: []
    });
  };

  const formatTime = (time) => {
    if (!time) return '';
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    });
  };

  const groupItineraryByDate = () => {
    const grouped = {};
    
    itinerary.forEach(item => {
      if (!grouped[item.date]) {
        grouped[item.date] = [];
      }
      grouped[item.date].push(item);
    });
    
    // Sort dates
    return Object.keys(grouped)
      .sort()
      .reduce((acc, date) => {
        acc[date] = grouped[date].sort((a, b) => {
          if (a.startTime && b.startTime) {
            return a.startTime.localeCompare(b.startTime);
          }
          return 0;
        });
        return acc;
      }, {});
  };

  const groupedItinerary = groupItineraryByDate();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Travel Itinerary</h2>
          <p className="text-gray-600">Plan and organize your trip activities</p>
        </div>
        
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Activity
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? 'Edit Itinerary Item' : 'Add New Itinerary Item'}
              </DialogTitle>
              <DialogDescription>
                {editingItem 
                  ? 'Update the details of this itinerary item.'
                  : 'Add a new activity, flight, accommodation, or other item to your itinerary.'
                }
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={editingItem ? handleUpdateItem : handleAddItem} className="space-y-4">
              {/* Activity Type */}
              <div className="space-y-2">
                <Label htmlFor="type">Activity Type</Label>
                <Select
                  value={editingItem ? editingItem.type : newItem.type}
                  onValueChange={(value) => editingItem 
                    ? setEditingItem(prev => ({ ...prev, type: value }))
                    : setNewItem(prev => ({ ...prev, type: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {activityTypes.map(activity => (
                      <SelectItem key={activity.value} value={activity.value}>
                        <div className="flex items-center">
                          {typeof activity.icon === 'string' ? (
                            <span className="mr-2">{activity.icon}</span>
                          ) : (
                            <activity.icon className="w-4 h-4 mr-2" />
                          )}
                          {activity.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Title and Date */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={editingItem ? editingItem.title : newItem.title}
                    onChange={(e) => editingItem
                      ? setEditingItem(prev => ({ ...prev, title: e.target.value }))
                      : setNewItem(prev => ({ ...prev, title: e.target.value }))
                    }
                    placeholder="Activity title"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="date">Date *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={editingItem ? editingItem.date : newItem.date}
                    onChange={(e) => editingItem
                      ? setEditingItem(prev => ({ ...prev, date: e.target.value }))
                      : setNewItem(prev => ({ ...prev, date: e.target.value }))
                    }
                    required
                  />
                </div>
              </div>

              {/* Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startTime">Start Time</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={editingItem ? editingItem.startTime : newItem.startTime}
                    onChange={(e) => editingItem
                      ? setEditingItem(prev => ({ ...prev, startTime: e.target.value }))
                      : setNewItem(prev => ({ ...prev, startTime: e.target.value }))
                    }
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="endTime">End Time</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={editingItem ? editingItem.endTime : newItem.endTime}
                    onChange={(e) => editingItem
                      ? setEditingItem(prev => ({ ...prev, endTime: e.target.value }))
                      : setNewItem(prev => ({ ...prev, endTime: e.target.value }))
                    }
                  />
                </div>
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={editingItem ? editingItem.location : newItem.location}
                  onChange={(e) => editingItem
                    ? setEditingItem(prev => ({ ...prev, location: e.target.value }))
                    : setNewItem(prev => ({ ...prev, location: e.target.value }))
                  }
                  placeholder="Venue or place name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={editingItem ? editingItem.address : newItem.address}
                  onChange={(e) => editingItem
                    ? setEditingItem(prev => ({ ...prev, address: e.target.value }))
                    : setNewItem(prev => ({ ...prev, address: e.target.value }))
                  }
                  placeholder="Full address"
                />
              </div>

              {/* Description and Notes */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={editingItem ? editingItem.description : newItem.description}
                  onChange={(e) => editingItem
                    ? setEditingItem(prev => ({ ...prev, description: e.target.value }))
                    : setNewItem(prev => ({ ...prev, description: e.target.value }))
                  }
                  placeholder="Activity details"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={editingItem ? editingItem.notes : newItem.notes}
                  onChange={(e) => editingItem
                    ? setEditingItem(prev => ({ ...prev, notes: e.target.value }))
                    : setNewItem(prev => ({ ...prev, notes: e.target.value }))
                  }
                  placeholder="Additional notes or reminders"
                  rows={2}
                />
              </div>

              {/* Cost and Booking Reference */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cost">Cost (₹)</Label>
                  <Input
                    id="cost"
                    type="number"
                    value={editingItem ? editingItem.cost : newItem.cost}
                    onChange={(e) => editingItem
                      ? setEditingItem(prev => ({ ...prev, cost: parseFloat(e.target.value) || 0 }))
                      : setNewItem(prev => ({ ...prev, cost: parseFloat(e.target.value) || 0 }))
                    }
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bookingReference">Booking Reference</Label>
                  <Input
                    id="bookingReference"
                    value={editingItem ? editingItem.bookingReference : newItem.bookingReference}
                    onChange={(e) => editingItem
                      ? setEditingItem(prev => ({ ...prev, bookingReference: e.target.value }))
                      : setNewItem(prev => ({ ...prev, bookingReference: e.target.value }))
                    }
                    placeholder="Booking ID or confirmation number"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowAddDialog(false);
                    setEditingItem(null);
                    resetForm();
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editingItem ? 'Update Item' : 'Add Item'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Itinerary Timeline */}
      {Object.keys(groupedItinerary).length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <CardTitle className="text-xl mb-2">No Itinerary Items</CardTitle>
            <CardDescription className="mb-6">
              Start building your itinerary by adding activities, flights, and accommodations.
            </CardDescription>
            <Button onClick={() => setShowAddDialog(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Activity
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedItinerary).map(([date, items]) => (
            <Card key={date}>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-lg">
                  <Calendar className="w-5 h-5 mr-2" />
                  {formatDate(date)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {items.map((item, index) => {
                    const ActivityIcon = getActivityIcon(item.type);
                    const color = getActivityColor(item.type);
                    
                    return (
                      <div
                        key={item.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, index)}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, index)}
                        className="flex items-start space-x-4 p-4 border rounded-lg hover:bg-gray-50 cursor-move group"
                      >
                        {/* Timeline dot */}
                        <div className={`w-3 h-3 rounded-full bg-${color}-500 mt-2 shrink-0`}></div>
                        
                        {/* Time */}
                        {(item.startTime || item.endTime) && (
                          <div className="flex items-center space-x-2 text-sm text-gray-500 min-w-[120px] shrink-0">
                            <Clock className="w-4 h-4" />
                            <span>
                              {item.startTime && formatTime(item.startTime)}
                              {item.endTime && ` - ${formatTime(item.endTime)}`}
                            </span>
                          </div>
                        )}
                        
                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center space-x-2 mb-1">
                              {typeof ActivityIcon === 'string' ? (
                                <span>{ActivityIcon}</span>
                              ) : (
                                <ActivityIcon className={`w-4 h-4 text-${color}-600`} />
                              )}
                              <Badge variant="outline" className={`border-${color}-200 text-${color}-700`}>
                                {activityTypes.find(a => a.value === item.type)?.label || item.type}
                              </Badge>
                            </div>
                            
                            <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setEditingItem(item)}
                              >
                                <Edit3 className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteItem(item.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                          
                          <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
                          
                          {item.description && (
                            <p className="text-gray-600 mb-2">{item.description}</p>
                          )}
                          
                          {(item.location || item.address) && (
                            <div className="flex items-center text-sm text-gray-500 mb-2">
                              <MapPin className="w-4 h-4 mr-1" />
                              <span>
                                {item.location}
                                {item.address && item.location && ' • '}
                                {item.address}
                              </span>
                            </div>
                          )}
                          
                          {(item.cost > 0 || item.bookingReference) && (
                            <div className="flex space-x-4 text-sm text-gray-500">
                              {item.cost > 0 && (
                                <span>Cost: ₹{item.cost.toLocaleString()}</span>
                              )}
                              {item.bookingReference && (
                                <span>Ref: {item.bookingReference}</span>
                              )}
                            </div>
                          )}
                          
                          {item.notes && (
                            <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm">
                              <strong>Notes:</strong> {item.notes}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}