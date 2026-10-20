

     addBusiness(newBiz: Omit<Business, 'id'>): Business {
    const list = this.getBusinesses();
    const created: Business = {
      ...newBiz,
      id: `biz-${Date.now()}`,
      logoUrl: newBiz.logoUrl || 'https://via.placeholder.com/150',
      bannerUrl: newBiz.bannerUrl || 'https://via.placeholder.com/600x200',
      ownerEmail: newBiz.ownerEmail || 'sponsor@myngenoegen.co.za',
      headline: newBiz.headline || `Supporting ${newBiz.businessName} & Myngenoegen Dalmada Community`,
      bodyText: newBiz.bodyText || 'Proud local sponsor supporting Myngenoegen Dalmada events and infrastructure projects.',
      dealOffer: newBiz.dealOffer || 'R500 Off for Myngenoegen App Users',
      couponCode: newBiz.couponCode || `MYNGENOEGEN-${Math.floor(Math.random() * 1000)}`,
      phone: newBiz.phone || '072 557 3204',
      address: newBiz.address || '24 Geluk Street, Myngenoegen, Dalmada, Polokwane',
      latitude: newBiz.latitude || -23.9045,
      longitude: newBiz.longitude || 29.4689,
    };
    const updated = [created, ...list];
    this.saveBusinesses(updated);
    return created;
  }

  addImprovement(newImp: Omit<NeighborhoodImprovement, 'id' | 'votes' | 'hasVoted' | 'fundedAmount' | 'updates'>): NeighborhoodImprovement {
    const list = this.getImprovements();
    const created: NeighborhoodImprovement = {
      ...newImp,
      id: `imp-${Date.now()}`,
      votes: 1,
      hasVoted: true,
      fundedAmount: 0,
      updates: [
        {
          id: `u-${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          status: newImp.status,
          note: 'Project issue reported to Myngenoegen Dalmada Community board.',
          author: newImp.reporterName
        }
      ]
    };
    const updated = [created, ...list];
    this.saveImprovements(updated);
    return created;
  }