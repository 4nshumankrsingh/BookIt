'use client';
import { useState, useEffect } from 'react';
import { Bell, BellOff, Plus, Trash2, Edit3, TrendingDown, IndianRupee, Calendar, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function PriceAlerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingAlert, setEditingAlert] = useState(null);

  const [newAlert, setNewAlert] = useState({
    from: '',
    to: '',
    fromName: '',
    toName: '',
    departureDate: '',
    returnDate: '',
    targetPrice: '',
    passengers: {
      adults: 1,
      children: 0,
      infants: 0
    },
    preferences: {
      cabinClass: 'economy',
      maxStops: 2,
      airlines: []
    },
    alertConfig: {
      frequency: 'daily',
      notificationMethods: {
        email: true,
        push: true,
        sms: false
      }
    }
  });

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      const response = await fetch('/api/flights/alerts');
      if (response.ok) {
        const data = await response.json();
        setAlerts(data);
      }
    } catch (error) {
      console.error('Error fetching alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAlert = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/flights/alerts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newAlert)
      });

      if (response.ok) {
        const createdAlert = await response.json();
        setAlerts(prev => [createdAlert, ...prev]);
        setShowCreateDialog(false);
        resetForm();
      } else {
        throw new Error('Failed to create alert');
      }
    } catch (error) {
      console.error('Error creating alert:', error);
      alert('Failed to create price alert. Please try again.');
    }
  };

  const handleUpdateAlert = async (alertId, updates) => {
    try {
      const response = await fetch(`/api/flights/alerts/${alertId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates)
      });

      if (response.ok) {
        const updatedAlert = await response.json();
        setAlerts(prev => prev.map(alert => 
          alert._id === alertId ? updatedAlert : alert
        ));
        setEditingAlert(null);
      }
    } catch (error) {
      console.error('Error updating alert:', error);
    }
  };

  const handleDeleteAlert = async (alertId) => {
    if (!confirm('Are you sure you want to delete this price alert?')) return;

    try {
      const response = await fetch(`/api/flights/alerts/${alertId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setAlerts(prev => prev.filter(alert => alert._id !== alertId));
      }
    } catch (error) {
      console.error('Error deleting alert:', error);
    }
  };

  const resetForm = () => {
    setNewAlert({
      from: '',
      to: '',
      fromName: '',
      toName: '',
      departureDate: '',
      returnDate: '',
      targetPrice: '',
      passengers: {
        adults: 1,
        children: 0,
        infants: 0
      },
      preferences: {
        cabinClass: 'economy',
        maxStops: 2,
        airlines: []
      },
      alertConfig: {
        frequency: 'daily',
        notificationMethods: {
          email: true,
          push: true,
          sms: false
        }
      }
    });
  };

  const getStatusBadge = (alert) => {
    const statusConfig = {
      active: { variant: 'default', label: 'Active' },
      paused: { variant: 'secondary', label: 'Paused' },
      cancelled: { variant: 'outline', label: 'Cancelled' },
      triggered: { variant: 'default', label: 'Triggered' }
    };
    
    const config = statusConfig[alert.status] || statusConfig.active;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading price alerts...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Price Alerts</h2>
          <p className="text-gray-600">Get notified when flight prices drop</p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Alert
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Price Alert</DialogTitle>
              <DialogDescription>
                Set up alerts to monitor flight prices and get notified when they drop.
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleCreateAlert} className="space-y-6">
              {/* Flight Route */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="from">From *</Label>
                  <Input
                    id="from"
                    value={newAlert.from}
                    onChange={(e) => setNewAlert(prev => ({ 
                      ...prev, 
                      from: e.target.value,
                      fromName: e.target.value // In real app, this would come from airport search
                    }))}
                    placeholder="Departure city or airport"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="to">To *</Label>
                  <Input
                    id="to"
                    value={newAlert.to}
                    onChange={(e) => setNewAlert(prev => ({ 
                      ...prev, 
                      to: e.target.value,
                      toName: e.target.value // In real app, this would come from airport search
                    }))}
                    placeholder="Arrival city or airport"
                    required
                  />
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="departureDate">Departure Date *</Label>
                  <Input
                    id="departureDate"
                    type="date"
                    value={newAlert.departureDate}
                    onChange={(e) => setNewAlert(prev => ({ ...prev, departureDate: e.target.value }))}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="returnDate">Return Date (Optional)</Label>
                  <Input
                    id="returnDate"
                    type="date"
                    value={newAlert.returnDate}
                    onChange={(e) => setNewAlert(prev => ({ ...prev, returnDate: e.target.value }))}
                    min={newAlert.departureDate || new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>

              {/* Target Price */}
              <div className="space-y-2">
                <Label htmlFor="targetPrice">Target Price (₹) *</Label>
                <Input
                  id="targetPrice"
                  type="number"
                  value={newAlert.targetPrice}
                  onChange={(e) => setNewAlert(prev => ({ ...prev, targetPrice: e.target.value }))}
                  placeholder="Enter your desired price"
                  required
                />
              </div>

              {/* Preferences */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="passengers">Passengers</Label>
                  <Select
                    value={newAlert.passengers.adults.toString()}
                    onValueChange={(value) => setNewAlert(prev => ({
                      ...prev,
                      passengers: { ...prev.passengers, adults: parseInt(value) }
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                        <SelectItem key={num} value={num.toString()}>
                          {num} {num === 1 ? 'Adult' : 'Adults'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="cabinClass">Cabin Class</Label>
                  <Select
                    value={newAlert.preferences.cabinClass}
                    onValueChange={(value) => setNewAlert(prev => ({
                      ...prev,
                      preferences: { ...prev.preferences, cabinClass: value }
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="economy">Economy</SelectItem>
                      <SelectItem value="premium_economy">Premium Economy</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                      <SelectItem value="first">First Class</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Alert Settings */}
              <div className="space-y-4">
                <Label>Alert Settings</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="frequency">Check Frequency</Label>
                    <Select
                      value={newAlert.alertConfig.frequency}
                      onValueChange={(value) => setNewAlert(prev => ({
                        ...prev,
                        alertConfig: { ...prev.alertConfig, frequency: value }
                      }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="realtime">Real-time</SelectItem>
                        <SelectItem value="hourly">Every Hour</SelectItem>
                        <SelectItem value="daily">Once Daily</SelectItem>
                        <SelectItem value="weekly">Once Weekly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Notifications</Label>
                    <div className="flex space-x-4">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={newAlert.alertConfig.notificationMethods.email}
                          onChange={(e) => setNewAlert(prev => ({
                            ...prev,
                            alertConfig: {
                              ...prev.alertConfig,
                              notificationMethods: {
                                ...prev.alertConfig.notificationMethods,
                                email: e.target.checked
                              }
                            }
                          }))}
                          className="mr-2"
                        />
                        Email
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={newAlert.alertConfig.notificationMethods.push}
                          onChange={(e) => setNewAlert(prev => ({
                            ...prev,
                            alertConfig: {
                              ...prev.alertConfig,
                              notificationMethods: {
                                ...prev.alertConfig.notificationMethods,
                                push: e.target.checked
                              }
                            }
                          }))}
                          className="mr-2"
                        />
                        Push
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowCreateDialog(false);
                    resetForm();
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  Create Alert
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Alerts List */}
      {alerts.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <CardTitle className="text-xl mb-2">No Price Alerts</CardTitle>
            <CardDescription className="mb-6">
              Create your first price alert to get notified when flight prices drop.
            </CardDescription>
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Alert
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {alerts.map((alert) => (
            <Card key={alert._id} className="relative">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-3">
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <span className="font-semibold">
                          {alert.flightRoute.from} → {alert.flightRoute.to}
                        </span>
                      </div>
                      {getStatusBadge(alert)}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        {formatDate(alert.dates.departure)}
                        {alert.dates.return && ` - ${formatDate(alert.dates.return)}`}
                      </div>
                      
                      <div className="flex items-center">
                        <IndianRupee className="w-4 h-4 mr-2" />
                        Target: {formatCurrency(alert.priceThresholds.target)}
                        {alert.priceThresholds.current && (
                          <span className="ml-2">
                            • Current: {formatCurrency(alert.priceThresholds.current)}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center">
                        <Bell className="w-4 h-4 mr-2" />
                        {alert.alertConfig.frequency} checks
                      </div>
                    </div>

                    {/* Price History */}
                    {alert.statistics && alert.statistics.checks > 0 && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                        <div className="flex justify-between text-sm">
                          <span>Checked {alert.statistics.checks} times</span>
                          {alert.priceThresholds.initial && alert.priceThresholds.current && (
                            <span className={
                              alert.priceThresholds.current < alert.priceThresholds.initial
                                ? 'text-green-600 font-semibold'
                                : 'text-gray-600'
                            }>
                              {alert.priceThresholds.current < alert.priceThresholds.initial ? (
                                <><TrendingDown className="w-4 h-4 inline mr-1" />
                                Save {formatCurrency(alert.savingsPercentage)}%</>
                              ) : (
                                'No significant changes'
                              )}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingAlert(alert)}
                    >
                      <Edit3 className="w-4 h-4" />
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUpdateAlert(alert._id, {
                        status: alert.status === 'active' ? 'paused' : 'active'
                      })}
                    >
                      {alert.status === 'active' ? (
                        <BellOff className="w-4 h-4" />
                      ) : (
                        <Bell className="w-4 h-4" />
                      )}
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteAlert(alert._id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}